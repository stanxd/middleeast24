
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import Footer from '../components/Footer';
import { sampleArticles } from '../data/sampleData';

const Index = () => {
  const newsArticles = sampleArticles.filter(article => article.category === 'News');
  const investigationsArticles = sampleArticles.filter(article => article.category === 'Investigations');
  const exclusiveArticles = sampleArticles.filter(article => article.category === 'Exclusive Sources');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        <CategorySection 
          title="Latest News" 
          articles={newsArticles.slice(0, 6)} 
          category="News"
        />
        
        <CategorySection 
          title="Investigations" 
          articles={investigationsArticles.slice(0, 4)} 
          category="Investigations"
        />
        
        <CategorySection 
          title="Exclusive Sources" 
          articles={exclusiveArticles.slice(0, 4)} 
          category="Exclusive Sources"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
