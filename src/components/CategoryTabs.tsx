
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ArticleCard from './ArticleCard';
import { sampleArticles } from '../data/sampleData';

const CategoryTabs = () => {
  const newsArticles = sampleArticles.filter(article => article.category === 'News');
  const investigationsArticles = sampleArticles.filter(article => article.category === 'Investigations');
  const exclusiveArticles = sampleArticles.filter(article => article.category === 'Exclusive Sources');

  return (
    <div className="w-full">
      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="news" className="text-lg font-semibold">
            News
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
            <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
            <button className="text-navy-900 font-medium hover:underline">
              View All →
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
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
