
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleGrid from './ArticleGrid';
import TabHeader from './TabHeader';
import { useRSSFeed } from '../hooks/useRSSFeed';
import { useSentimentAnalysis } from '../hooks/useSentimentAnalysis';
import { sampleArticles } from '../data/sampleData';
import { Article } from '../types/Article';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const CategoryTabs = () => {
  const { articles: rssArticles, loading: rssLoading, error: rssError } = useRSSFeed('https://english.alarabiya.net/feed/rss2/en/News.xml');
  const { analyzeSentiment, isModelReady } = useSentimentAnalysis();
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [processedArticles, setProcessedArticles] = useState<Article[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  // Process articles with sentiment analysis
  useEffect(() => {
    const processArticlesWithSentiment = async () => {
      // Combine published articles with RSS articles, prioritizing published articles
      const allArticles = [
        ...(publishedArticles || []),
        ...rssArticles.slice(0, Math.max(0, 15 - (publishedArticles?.length || 0)))
      ];

      // Always set the combined articles first
      if (allArticles.length > 0) {
        setProcessedArticles(allArticles);
      }

      if (!isModelReady || allArticles.length === 0) {
        return;
      }

      setIsAnalyzing(true);
      console.log('Starting sentiment analysis for articles...');

      try {
        const articlesWithSentiment = await Promise.all(
          allArticles.slice(0, 15).map(async (article) => {
            try {
              const sentimentResult = await analyzeSentiment(article.title + ' ' + article.excerpt);
              if (sentimentResult) {
                return {
                  ...article,
                  sentiment: sentimentResult.label,
                  sentimentConfidence: sentimentResult.confidence
                };
              }
              return article;
            } catch (error) {
              console.error('Error analyzing sentiment for article:', article.id, error);
              return article;
            }
          })
        );

        setProcessedArticles(articlesWithSentiment);
        console.log('Sentiment analysis completed');
      } catch (error) {
        console.error('Error in sentiment analysis process:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    processArticlesWithSentiment();
  }, [publishedArticles, rssArticles, isModelReady, analyzeSentiment]);

  // Process sample articles with sentiment analysis (for Investigations and Exclusive tabs)
  useEffect(() => {
    const processSampleArticlesWithSentiment = async () => {
      if (!isModelReady) {
        return;
      }

      setIsAnalyzing(true);
      console.log('Starting sentiment analysis for sample articles...');

      try {
        // Apply sentiment analysis to sample articles
        const sampleWithSentiment = await Promise.all(
          sampleArticles.map(async (article) => {
            try {
              const sentimentResult = await analyzeSentiment(article.title + ' ' + article.excerpt);
              if (sentimentResult) {
                return {
                  ...article,
                  sentiment: sentimentResult.label,
                  sentimentConfidence: sentimentResult.confidence
                };
              }
              return article;
            } catch (error) {
              console.error('Error analyzing sentiment for sample article:', article.id, error);
              return article;
            }
          })
        );

        // Update the sample articles with sentiment
        sampleArticles.forEach((article, index) => {
          if (sampleWithSentiment[index].sentiment) {
            article.sentiment = sampleWithSentiment[index].sentiment;
            article.sentimentConfidence = sampleWithSentiment[index].sentimentConfidence;
          }
        });
        
        console.log('Sample articles sentiment analysis completed');
      } catch (error) {
        console.error('Error in sample articles sentiment analysis process:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    processSampleArticlesWithSentiment();
  }, [isModelReady, analyzeSentiment]);

  // Filter articles by sentiment
  const getFilteredArticles = (articles: Article[]) => {
    if (sentimentFilter === 'all') {
      return articles;
    }
    return articles.filter(article => article.sentiment === sentimentFilter);
  };

  // For News tab, use processed articles (published + RSS combined)
  const newsArticles = getFilteredArticles(processedArticles.slice(0, 15));
  
  // For other tabs, use filtered sample articles
  const investigationsArticles = getFilteredArticles(sampleArticles.filter(article => article.category === 'Investigations'));
  const exclusiveArticles = getFilteredArticles(sampleArticles.filter(article => article.category === 'Exclusive Sources'));

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
          <TabHeader
            title="Latest News"
            description="Stay updated with the latest developments from the Middle East"
            color="blue"
            sentimentFilter={sentimentFilter}
            onSentimentChange={setSentimentFilter}
            showAIStatus={true}
            isAnalyzing={isAnalyzing}
            isModelReady={isModelReady}
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
