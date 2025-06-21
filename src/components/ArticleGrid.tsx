
import React from 'react';
import ArticleCard from './ArticleCard';
import { Article } from '../types/Article';

interface ArticleGridProps {
  articles: Article[];
  category: string;
  isLoading: boolean;
  error: string | null;
  sentimentFilter: string;
  showSponsorButton?: boolean;
}

const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  category,
  isLoading,
  error,
  sentimentFilter,
  showSponsorButton = false
}) => {
  if (isLoading && category === 'news') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-4 sm:p-6 animate-pulse shadow-sm">
            <div className="bg-gray-300 h-32 sm:h-48 rounded-xl mb-4"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 rounded mb-2 w-3/4"></div>
            <div className="bg-gray-300 h-3 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error && category === 'news') {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 max-w-md mx-auto shadow-sm">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <p className="text-red-600 font-semibold mb-2">Unable to load latest news</p>
          <p className="text-red-500 text-sm mb-4">Please check your internet connection and try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    const isFiltered = sentimentFilter !== 'all';
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-gray-400 text-2xl">📰</span>
        </div>
        <p className="text-gray-500 font-medium">
          {isFiltered ? `No ${sentimentFilter} articles found.` : 'No articles available at the moment.'}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          {isFiltered ? 'Try selecting a different sentiment filter.' : 'Check back later for updates.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {articles.map((article, index) => (
        <ArticleCard 
          key={`${category}-${index}`} 
          article={article} 
          showSponsorButton={showSponsorButton}
        />
      ))}
    </div>
  );
};

export default ArticleGrid;
