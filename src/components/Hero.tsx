
import React from 'react';
import { sampleArticles } from '../data/sampleData';

const Hero = () => {
  const featuredArticle = sampleArticles[0];

  return (
    <section className="bg-navy-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                BREAKING
              </span>
              <span className="text-gray-300 text-sm">{featuredArticle.category}</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              {featuredArticle.title}
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              {featuredArticle.excerpt}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>By {featuredArticle.author}</span>
              <span>•</span>
              <span>{featuredArticle.publishDate}</span>
            </div>
            
            <button className="bg-white text-navy-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Read Full Story
            </button>
          </div>
          
          <div className="relative">
            <img 
              src={featuredArticle.image} 
              alt={featuredArticle.title}
              className="w-full h-80 lg:h-96 object-cover rounded-lg"
            />
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-3 py-1 rounded">
              <img 
                src="/lovable-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png" 
                alt="ME24 Logo" 
                className="h-6 w-6 opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
