import React, { useEffect } from 'react';
import { Article } from '../types/Article';

interface MetaTagsManagerProps {
  article?: Article;
  imageUrl?: string;
}

/**
 * Component to manage meta tags for social media sharing
 * This component doesn't render anything visible but updates the document head
 */
const MetaTagsManager: React.FC<MetaTagsManagerProps> = ({ article, imageUrl }) => {
  useEffect(() => {
    if (!article) return;

    // Update meta tags for the current article
    const updateMetaTags = () => {
      // Helper function to update or create a meta tag
      const setMetaTag = (property: string, content: string) => {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', property);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
      };

      // Set Open Graph meta tags
      setMetaTag('og:title', article.title);
      setMetaTag('og:description', article.excerpt);
      setMetaTag('og:type', 'article');
      setMetaTag('og:url', `https://middleeast24.org/article/${article.id}`);
      
      // Set image if provided, otherwise use the article image
      if (imageUrl) {
        setMetaTag('og:image', imageUrl);
      } else {
        setMetaTag('og:image', article.image);
      }
      
      // Set Twitter meta tags
      const setTwitterTag = (name: string, content: string) => {
        let metaTag = document.querySelector(`meta[name="${name}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('name', name);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
      };
      
      setTwitterTag('twitter:title', article.title);
      setTwitterTag('twitter:description', article.excerpt);
      if (imageUrl) {
        setTwitterTag('twitter:image', imageUrl);
      } else {
        setTwitterTag('twitter:image', article.image);
      }
    };

    updateMetaTags();

    // Cleanup function to restore default meta tags
    return () => {
      const defaultTitle = 'MiddleEast24 - Middle East News & Analysis';
      const defaultDesc = 'Your trusted source for Middle East news, investigations, and exclusive reporting.';
      const defaultImage = '/middleeast24-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png';
      
      // Restore default Open Graph meta tags
      const setMetaTag = (property: string, content: string) => {
        const metaTag = document.querySelector(`meta[property="${property}"]`);
        if (metaTag) {
          metaTag.setAttribute('content', content);
        }
      };
      
      setMetaTag('og:title', defaultTitle);
      setMetaTag('og:description', defaultDesc);
      setMetaTag('og:type', 'website');
      setMetaTag('og:url', 'https://middleeast24.org');
      setMetaTag('og:image', defaultImage);
      
      // Restore default Twitter meta tags
      const setTwitterTag = (name: string, content: string) => {
        const metaTag = document.querySelector(`meta[name="${name}"]`);
        if (metaTag) {
          metaTag.setAttribute('content', content);
        }
      };
      
      setTwitterTag('twitter:title', defaultTitle);
      setTwitterTag('twitter:description', defaultDesc);
      setTwitterTag('twitter:image', defaultImage);
    };
  }, [article, imageUrl]);

  // This component doesn't render anything visible
  return null;
};

export default MetaTagsManager;
