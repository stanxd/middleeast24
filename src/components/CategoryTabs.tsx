
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleCard from './ArticleCard';
import { useRSSFeed } from '../hooks/useRSSFeed';
import { sampleArticles } from '../data/sampleData';

const CategoryTabs = () => {
  const { articles: rssArticles, loading: rssLoading, error: rssError } = useRSSFeed('https://english.alarabiya.net/feed/rss2/en/News.xml');

  // For News tab, use RSS articles (limited to 15)
  const newsArticles = rssArticles.slice(0, 15);
  
  // For other tabs, use filtered sample articles
  const investigationsArticles = sampleArticles.filter(article => article.category === 'Investigations');
  const exclusiveArticles = sampleArticles.filter(article => article.category === 'Exclusive Sources');

  const renderArticles = (articles, category) => {
    if (rssLoading && category === 'news') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-4 sm:p-6 animate-pulse">
              <div className="bg-gray-300 h-32 sm:h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-300 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 h-4 rounded mb-2 w-3/4"></div>
              <div className="bg-gray-300 h-3 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }

    if (rssError && category === 'news') {
      return (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
            <p className="text-red-600 font-medium mb-2">Unable to load latest news</p>
            <p className="text-red-500 text-sm">Please check your internet connection and try again.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (articles.length === 0) {
      return (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500">No articles available at the moment.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {articles.map((article, index) => (
          <ArticleCard 
            key={`${category}-${index}`} 
            article={article} 
            showSponsorButton={category === 'investigations'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 h-auto">
          <TabsTrigger value="news" className="text-sm sm:text-base py-2 sm:py-3">
            News
          </TabsTrigger>
          <TabsTrigger value="investigations" className="text-sm sm:text-base py-2 sm:py-3">
            Investigations
          </TabsTrigger>
          <TabsTrigger value="exclusive" className="text-sm sm:text-base py-2 sm:py-3">
            Exclusive Sources
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="news">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Latest News</h2>
            <p className="text-sm sm:text-base text-gray-600">Stay updated with the latest developments from the Middle East</p>
          </div>
          {renderArticles(newsArticles, 'news')}
        </TabsContent>
        
        <TabsContent value="investigations">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Investigative Reports</h2>
            <p className="text-sm sm:text-base text-gray-600">In-depth analysis and investigative journalism</p>
          </div>
          {renderArticles(investigationsArticles, 'investigations')}
        </TabsContent>
        
        <TabsContent value="exclusive">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Exclusive Sources</h2>
            <p className="text-sm sm:text-base text-gray-600">Exclusive stories from our trusted network of sources</p>
          </div>
          {renderArticles(exclusiveArticles, 'exclusive')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryTabs;
