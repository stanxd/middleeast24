
import React, { useState } from 'react';
import { useRSSFeed } from '../hooks/useRSSFeed';
import { sampleArticles } from '../data/sampleData';
import ArticleModal from './ArticleModal';

const Hero = () => {
  const { articles: rssArticles, loading: rssLoading } = useRSSFeed('https://english.alarabiya.net/feed/rss2/en.xml');
  const [modalOpen, setModalOpen] = useState(false);
  
  // Use the first RSS article if available, otherwise fallback to sample
  const featuredArticle = (!rssLoading && rssArticles.length > 0) ? rssArticles[0] : sampleArticles[0];

  const handleReadFullStory = () => {
    setModalOpen(true);
  };

  return (
    <>
      <section className="hero-gradient text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-block w-fit">
                  BREAKING
                </span>
                <span className="text-gray-300 text-xs sm:text-sm">{featuredArticle.category}</span>
              </div>
              
              <h1 
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight cursor-pointer hover:text-gray-200 transition-colors"
                onClick={handleReadFullStory}
              >
                {featuredArticle.title}
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed">
                {featuredArticle.excerpt}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-400">
                <span>By {featuredArticle.author}</span>
                <span className="hidden sm:inline">•</span>
                <span>{featuredArticle.publishDate}</span>
              </div>
              
              <button 
                onClick={handleReadFullStory}
                className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base w-fit cursor-pointer"
              >
                Read Full Story
              </button>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title}
                className="w-full h-48 sm:h-64 lg:h-80 xl:h-96 object-cover rounded-lg"
              />
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-3 py-1 rounded">
                <img 
                  src="/lovable-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png" 
                  alt="ME24 Logo" 
                  className="h-4 sm:h-6 w-4 sm:w-6 opacity-70"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ArticleModal
        article={featuredArticle}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default Hero;
