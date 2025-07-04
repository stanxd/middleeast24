/**
 * Utility functions for article sharing functionality
 */

import { Article } from '../types/Article';

/**
 * Creates a share URL with appropriate metadata for social media platforms
 */
export const createShareUrl = (article: Article, baseUrl: string = 'https://middleeast24.org'): string => {
  // Create the URL to the article
  const articleUrl = `${baseUrl}/article/${article.id}`;
  return articleUrl;
};

/**
 * Generates a share title for the article
 */
export const getShareTitle = (article: Article): string => {
  return article.title;
};

/**
 * Generates a share description for the article
 */
export const getShareDescription = (article: Article): string => {
  // Use the excerpt or generate a short description from content
  return article.excerpt || article.content.substring(0, 150) + '...';
};

/**
 * Share article to various platforms
 */
export const shareArticle = async (article: Article): Promise<void> => {
  const url = createShareUrl(article);
  const title = getShareTitle(article);
  const text = getShareDescription(article);
  
  // Check if the Web Share API is available
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      console.log('Article shared successfully');
    } catch (error) {
      console.error('Error sharing article:', error);
      // Fallback to manual share options if Web Share API fails
      showShareOptions(article, url);
    }
  } else {
    // Fallback for browsers that don't support the Web Share API
    showShareOptions(article, url);
  }
};

/**
 * Show manual share options for different platforms
 */
const showShareOptions = (article: Article, url: string): void => {
  // Create a container for share options
  const container = document.createElement('div');
  container.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  
  // Create the share options modal
  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-lg p-6 max-w-md w-full';
  modal.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Share Article</h3>
      <button id="close-share-modal" class="text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="grid grid-cols-3 gap-4">
      <button id="share-facebook" class="flex flex-col items-center justify-center p-3 bg-blue-100 rounded-lg hover:bg-blue-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
        <span class="mt-2 text-sm">Facebook</span>
      </button>
      <button id="share-twitter" class="flex flex-col items-center justify-center p-3 bg-blue-100 rounded-lg hover:bg-blue-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1DA1F2">
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
        </svg>
        <span class="mt-2 text-sm">Twitter</span>
      </button>
      <button id="share-whatsapp" class="flex flex-col items-center justify-center p-3 bg-blue-100 rounded-lg hover:bg-blue-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span class="mt-2 text-sm">WhatsApp</span>
      </button>
    </div>
  `;
  
  container.appendChild(modal);
  document.body.appendChild(container);
  
  // Add event listeners
  const closeButton = document.getElementById('close-share-modal');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      document.body.removeChild(container);
    });
  }
  
  // Facebook share
  const facebookButton = document.getElementById('share-facebook');
  if (facebookButton) {
    facebookButton.addEventListener('click', () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      document.body.removeChild(container);
    });
  }
  
  // Twitter share
  const twitterButton = document.getElementById('share-twitter');
  if (twitterButton) {
    twitterButton.addEventListener('click', () => {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank');
      document.body.removeChild(container);
    });
  }
  
  // WhatsApp share
  const whatsappButton = document.getElementById('share-whatsapp');
  if (whatsappButton) {
    whatsappButton.addEventListener('click', () => {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(article.title + ' ' + url)}`;
      window.open(whatsappUrl, '_blank');
      document.body.removeChild(container);
    });
  }
  
  // Close modal when clicking outside
  container.addEventListener('click', (e) => {
    if (e.target === container) {
      document.body.removeChild(container);
    }
  });
};
