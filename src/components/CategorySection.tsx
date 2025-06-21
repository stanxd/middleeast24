
import React from 'react';
import ArticleCard from './ArticleCard';
import { Article } from '../types/Article';

interface CategorySectionProps {
  title: string;
  articles: Article[];
  category: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, articles, category }) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <button className="text-navy-900 font-medium hover:underline">
          View All →
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
