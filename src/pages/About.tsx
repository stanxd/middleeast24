
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">MiddleEast24</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg">
            <div className="flex items-center justify-center mb-8">
              <img 
                src="/lovable-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png" 
                alt="MiddleEast24 Logo" 
                className="h-20 w-20"
              />
            </div>
            
            <div className="text-center">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8">
                The new voice of the Middle East - aggregating and curating news, politics and trends from the Middle East and North Africa, In partnership with visegrad24.com
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  We are committed to delivering accurate, unbiased, and comprehensive coverage of events shaping the Middle East and North Africa region. Through strategic partnerships and dedicated journalism, we bring you the stories that matter most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
