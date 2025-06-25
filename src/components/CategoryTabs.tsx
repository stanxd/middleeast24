
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleGrid from './ArticleGrid';
import TabHeader from './TabHeader';
import { useRSSArticles } from '../hooks/useRSSArticles';
import { useSentimentAnalysis } from '../hooks/useSentimentAnalysis';
import { sampleArticles } from '../data/sampleData';
import { Article } from '../types/Article';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

const CategoryTabs = () => {
  const location = useLocation();
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const { 
    articles: rssArticles, 
    loading: rssLoading, 
    error: rssError, 
    refresh: refreshRSSArticles,
    lastRefreshed
  } = useRSSArticles(sentimentFilter);
  const { isModelReady } = useSentimentAnalysis();
  const [processedArticles, setProcessedArticles] = useState<Article[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Get the active tab from URL parameters
  const getActiveTabFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    return tab === 'news' || tab === 'investigations' || tab === 'exclusive' ? tab : 'news';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromURL());
  
  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromURL());
  }, [location.search]);

  // Fetch published articles from database
  const { data: publishedArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ['published-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false });
      
      if (error) throw error;
      
      // Convert database articles to match Article type
      return data.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category as 'News' | 'Investigations' | 'Exclusive Sources',
        publishDate: new Date(article.publish_date).toLocaleDateString(),
        image: article.image_url || '/placeholder.svg',
        featured: article.featured,
        tags: article.tags || []
      })) as Article[];
    }
  });

  // Combine published articles with RSS articles
  useEffect(() => {
    // Combine published articles with RSS articles, prioritizing published articles
    const allArticles = [
      ...(publishedArticles || []),
      ...rssArticles.slice(0, Math.max(0, 15 - (publishedArticles?.length || 0)))
    ];

    // Set the combined articles
    if (allArticles.length > 0) {
      setProcessedArticles(allArticles);
    }
  }, [publishedArticles, rssArticles]);

  // Set analyzing state based on loading state
  useEffect(() => {
    setIsAnalyzing(rssLoading);
  }, [rssLoading]);

  // For News tab, use processed articles (published + RSS combined)
  const newsArticles = processedArticles.slice(0, 15);
  
  // For other tabs, use filtered sample articles
  const investigationsArticles = sampleArticles
    .filter(article => article.category === 'Investigations')
    .filter(article => sentimentFilter === 'all' || article.sentiment === sentimentFilter);
    
  const exclusiveArticles = sampleArticles
    .filter(article => article.category === 'Exclusive Sources')
    .filter(article => sentimentFilter === 'all' || article.sentiment === sentimentFilter);

  return (
    <div className="w-full">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          <TabHeader
            title="Latest News"
            description="Stay updated with the latest developments from the Middle East"
            color="blue"
            sentimentFilter={sentimentFilter}
            onSentimentChange={setSentimentFilter}
            showAIStatus={true}
            isAnalyzing={isAnalyzing}
            isModelReady={isModelReady}
            onRefresh={refreshRSSArticles}
            lastRefreshed={lastRefreshed}
          />
          <ArticleGrid
            articles={newsArticles}
            category="news"
            isLoading={articlesLoading || rssLoading}
            error={rssError}
            sentimentFilter={sentimentFilter}
          />
        </TabsContent>
        
        <TabsContent value="investigations" className="mt-0">
          <TabHeader
            title="Investigative Reports"
            description="In-depth analysis and investigative journalism"
            color="red"
            sentimentFilter={sentimentFilter}
            onSentimentChange={setSentimentFilter}
            showAIStatus={true}
            isAnalyzing={isAnalyzing}
            isModelReady={isModelReady}
          />
          <ArticleGrid
            articles={investigationsArticles}
            category="investigations"
            isLoading={false}
            error={null}
            sentimentFilter={sentimentFilter}
            showSponsorButton={true}
          />
        </TabsContent>
        
        <TabsContent value="exclusive" className="mt-0">
          <TabHeader
            title="Exclusive Sources"
            description="Exclusive stories from our trusted network of sources"
            color="green"
            sentimentFilter={sentimentFilter}
            onSentimentChange={setSentimentFilter}
            showAIStatus={true}
            isAnalyzing={isAnalyzing}
            isModelReady={isModelReady}
          />
          <ArticleGrid
            articles={exclusiveArticles}
            category="exclusive"
            isLoading={false}
            error={null}
            sentimentFilter={sentimentFilter}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryTabs;
