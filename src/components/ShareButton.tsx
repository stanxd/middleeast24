import React, { useState } from 'react';
import { Share } from 'lucide-react';
import { Article } from '../types/Article';
import { shareArticle } from '../utils/shareUtils';
import ShareImageGenerator from './ShareImageGenerator';
import MetaTagsManager from './MetaTagsManager';

interface ShareButtonProps {
  article: Article;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ article, className = '' }) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shareImage, setShareImage] = useState<string | null>(null);

  const handleShare = async () => {
    setIsGeneratingImage(true);
    
    // If we already have a generated image, use it directly
    if (shareImage) {
      await shareArticle(article);
      setIsGeneratingImage(false);
      return;
    }
    
    // Otherwise, wait for the image to be generated first
    // The ShareImageGenerator component will handle this and call onImageGenerated
  };

  const handleImageGenerated = async (imageUrl: string) => {
    setShareImage(imageUrl);
    
    // Create a meta tag for the image if it doesn't exist
    let metaTag = document.querySelector('meta[property="og:image"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('property', 'og:image');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', imageUrl);
    
    // Create meta tags for title and description if they don't exist
    let titleTag = document.querySelector('meta[property="og:title"]');
    if (!titleTag) {
      titleTag = document.createElement('meta');
      titleTag.setAttribute('property', 'og:title');
      document.head.appendChild(titleTag);
    }
    titleTag.setAttribute('content', article.title);
    
    let descTag = document.querySelector('meta[property="og:description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('property', 'og:description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', article.excerpt);
    
    // Now share the article
    await shareArticle(article);
    setIsGeneratingImage(false);
  };

  return (
    <>
      <button 
        className={`text-gray-400 hover:text-navy-900 transition-colors flex items-center space-x-1 ${className} ${isGeneratingImage ? 'opacity-50 cursor-wait' : ''}`}
        onClick={handleShare}
        disabled={isGeneratingImage}
      >
        <Share className="h-4 w-4" />
        <span className="text-xs">Share</span>
      </button>
      
      {/* Hidden component that generates the share image */}
      {isGeneratingImage && !shareImage && (
        <ShareImageGenerator 
          article={article} 
          onImageGenerated={handleImageGenerated} 
        />
      )}
      
      {/* Meta tags manager for social sharing */}
      {shareImage && <MetaTagsManager article={article} imageUrl={shareImage} />}
    </>
  );
};

export default ShareButton;
