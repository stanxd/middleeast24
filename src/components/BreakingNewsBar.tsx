import React, { useState, useEffect, useRef } from 'react';
import { useRSSArticles } from '../hooks/useRSSArticles';
import ArticleModal from './ArticleModal';
import { Article } from '../types/Article';

const BreakingNewsBar = () => {
  const { articles, loading } = useRSSArticles();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Filter to get only the most recent articles (last 10)
  const recentArticles = !loading && articles.length > 0 
    ? articles.slice(0, 10) 
    : [];

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setModalOpen(true);
  };

  // Set up the animation for the ticker
  useEffect(() => {
    if (tickerRef.current && recentArticles.length > 0) {
      const tickerContent = tickerRef.current;
      const tickerWidth = tickerContent.scrollWidth;
      const animationDuration = tickerWidth * 0.02; // Adjust speed based on content width

      // Apply animation dynamically
      tickerContent.style.animationDuration = `${animationDuration}s`;
    }
  }, [recentArticles, loading]);

  // Format date for display
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-red-600 text-white border-b overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-2">
          <div className="flex-shrink-0 mr-4 font-bold">BREAKING NEWS:</div>
          
          <div className="ticker-container overflow-hidden flex-grow">
            {loading ? (
              <div className="text-sm">Loading latest news...</div>
            ) : recentArticles.length > 0 ? (
              <div 
                ref={tickerRef} 
                className="ticker-content whitespace-nowrap animate-ticker"
              >
                {recentArticles.map((article, index) => (
                  <span key={article.id} className="inline-flex items-center">
                    <span 
                      className="ticker-item cursor-pointer hover:underline"
                      onClick={() => handleArticleClick(article)}
                    >
                      {article.title}
                    </span>
                    {index < recentArticles.length - 1 && (
                      <span className="mx-4">•</span>
                    )}
                  </span>
                ))}
                {/* Duplicate the first few items to create a seamless loop */}
                {recentArticles.slice(0, 3).map((article, index) => (
                  <span key={`duplicate-${article.id}`} className="inline-flex items-center">
                    <span className="mx-4">•</span>
                    <span 
                      className="ticker-item cursor-pointer hover:underline"
                      onClick={() => handleArticleClick(article)}
                    >
                      {article.title}
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-sm">No recent news available</div>
            )}
          </div>
          
          <div className="flex-shrink-0 ml-4 text-xs hidden sm:block">
            {currentDate}
          </div>
        </div>
      </div>

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BreakingNewsBar;
