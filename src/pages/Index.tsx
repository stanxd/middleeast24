
import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import BreakingNewsBar from '../components/BreakingNewsBar';
import CategoryTabs from '../components/CategoryTabs';
import ServicesSection from '../components/ServicesSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <BreakingNewsBar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <CategoryTabs />
      </main>
      
      <ServicesSection />
      
      <Footer />
    </div>
  );
};

export default Index;
