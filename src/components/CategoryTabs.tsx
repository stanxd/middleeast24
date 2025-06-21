
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Rss, RefreshCw, AlertCircle } from 'lucide-react';
import ArticleCard from './ArticleCard';
import { sampleArticles } from '../data/sampleData';
import { useRSSFeed } from '../hooks/useRSSFeed';

const CategoryTabs = () => {
  const { articles: rssArticles, loading: rssLoading, error: rssError } = useRSSFeed('https://english.alarabiya.net/feed/rss2/en/News.xml');
  const investigationsArticles = sampleArticles.filter(article => article.category === 'Investigations');
  const exclusiveArticles = sampleArticles.filter(article => article.category === 'Exclusive Sources');

  const handleRetryRSS = () => {
    window.location.reload();
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="news" className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Rss className="h-4 w-4" />
              News
            </div>
          </TabsTrigger>
          <TabsTrigger value="investigations" className="text-lg font-semibold">
            Investigations
          </TabsTrigger>
          <TabsTrigger value="exclusive" className="text-lg font-semibold">
            Exclusive Sources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
              {!rssError && (
                <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                  <Rss className="h-3 w-3" />
                  Live RSS Feed
                </div>
              )}
              {rssError && (
                <div className="flex items-center gap-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                  <AlertCircle className="h-3 w-3" />
                  RSS Feed Error
                </div>
              )}
            </div>
            <button className="text-navy-900 font-medium hover:underline">
              View All →
            </button>
          </div>
          
          {rssLoading && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-3 rounded-lg">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Loading latest news from Al Arabiya...</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {rssError && (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load RSS Feed</h3>
              <p className="text-red-700 mb-4">We're having trouble connecting to the Al Arabiya news feed.</p>
              <button 
                onClick={handleRetryRSS}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Loading News
              </button>
            </div>
          )}
          
          {!rssLoading && !rssError && rssArticles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg">
                <Rss className="h-4 w-4" />
                <span className="text-sm font-medium">Successfully loaded {rssArticles.length} articles from Al Arabiya RSS feed</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rssArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {!rssLoading && !rssError && rssArticles.length === 0 && (
            <div className="text-center py-12 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">No Articles Found</h3>
              <p className="text-yellow-700 mb-4">The RSS feed was loaded but no articles were found.</p>
              <button 
                onClick={handleRetryRSS}
                className="inline-flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Loading News
              </button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="investigations" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Investigations</h2>
            <button className="text-navy-900 font-medium hover:underline">
              View All →
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investigationsArticles.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exclusive" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Exclusive Sources</h2>
            <button className="text-navy-900 font-medium hover:underline">
              View All →
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exclusiveArticles.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryTabs;
