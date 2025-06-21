
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

    if (rssError && category === 'news') {
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
      return (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-2xl">📰</span>
          </div>
          <p className="text-gray-500 font-medium">No articles available at the moment.</p>
          <p className="text-gray-400 text-sm mt-1">Check back later for updates.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 pb-2 mb-6 sm:mb-8">
          <TabsList className="grid w-full grid-cols-3 h-auto bg-gradient-to-r from-navy-50 to-blue-50 border border-navy-200 shadow-sm rounded-xl p-1">
            <TabsTrigger 
              value="news" 
              className="text-sm sm:text-base py-3 sm:py-4 font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-navy-900 data-[state=inactive]:text-gray-600 transition-all duration-200 hover:bg-white/50"
            >
              <span className="hidden sm:inline">📰 News</span>
              <span className="sm:hidden">📰</span>
            </TabsTrigger>
            <TabsTrigger 
              value="investigations" 
              className="text-sm sm:text-base py-3 sm:py-4 font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-700 data-[state=inactive]:text-gray-600 transition-all duration-200 hover:bg-white/50"
            >
              <span className="hidden sm:inline">🔍 Investigations</span>
              <span className="sm:hidden">🔍</span>
            </TabsTrigger>
            <TabsTrigger 
              value="exclusive" 
              className="text-sm sm:text-base py-3 sm:py-4 font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-700 data-[state=inactive]:text-gray-600 transition-all duration-200 hover:bg-white/50"
            >
              <span className="hidden sm:inline">⭐ Exclusive</span>
              <span className="sm:hidden">⭐</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="news" className="mt-0">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Latest News</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 pl-7">Stay updated with the latest developments from the Middle East</p>
          </div>
          {renderArticles(newsArticles, 'news')}
        </TabsContent>
        
        <TabsContent value="investigations" className="mt-0">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Investigative Reports</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 pl-7">In-depth analysis and investigative journalism</p>
          </div>
          {renderArticles(investigationsArticles, 'investigations')}
        </TabsContent>
        
        <TabsContent value="exclusive" className="mt-0">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Exclusive Sources</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 pl-7">Exclusive stories from our trusted network of sources</p>
          </div>
          {renderArticles(exclusiveArticles, 'exclusive')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryTabs;
