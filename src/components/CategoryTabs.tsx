import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Rss } from 'lucide-react';
import ArticleCard from './ArticleCard';
import { sampleArticles } from '../data/sampleData';
import { useRSSFeed } from '../hooks/useRSSFeed';

const CategoryTabs = () => {
  const { articles: rssArticles, loading: rssLoading, error: rssError } = useRSSFeed('https://english.alarabiya.net/feed/rss2/en/News.xml');
  const investigationsArticles = sampleArticles.filter(article => article.category === 'Investigations');
  const exclusiveArticles = sampleArticles.filter(article => article.category === 'Exclusive Sources');

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
              <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                <Rss className="h-3 w-3" />
                Live RSS Feed
              </div>
            </div>
            <button className="text-navy-900 font-medium hover:underline">
              View All →
            </button>
          </div>
          
          {rssLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          )}
          
          {rssError && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Failed to load RSS feed</p>
              <p className="text-gray-600">Showing sample articles instead</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {sampleArticles.filter(article => article.category === 'News').slice(0, 6).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
          
          {!rssLoading && !rssError && rssArticles.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rssArticles.slice(0, 6).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
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
