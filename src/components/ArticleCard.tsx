
import React, { useState } from 'react';
import { Clock, User, DollarSign } from 'lucide-react';
import { Article } from '../types/Article';
import DonationModal from './DonationModal';
import ArticleModal from './ArticleModal';
import SentimentBadge from './SentimentBadge';
import ShareButton from './ShareButton';

interface ArticleCardProps {
  article: Article;
  showSponsorButton?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, showSponsorButton = false }) => {
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'News': return 'bg-blue-600';
      case 'Investigations': return 'bg-red-600';
      case 'Exclusive Sources': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const handleArticleClick = () => {
    setArticleModalOpen(true);
  };

  return (
    <>
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="relative" onClick={handleArticleClick}>
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className={`${getCategoryColor(article.category)} text-white px-2 py-1 rounded text-xs font-medium`}>
              {article.category}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex items-center">
            {article.sentiment && (
              <div className="w-full">
                <SentimentBadge 
                  sentiment={article.sentiment} 
                  confidence={article.sentimentConfidence}
                  width="full"
                />
              </div>
            )}
          </div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 p-1 rounded">
            <img 
              src="/lovable-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png" 
              alt="ME24 Logo" 
              className="h-4 w-4 opacity-70"
            />
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <h3 
            className="text-lg font-semibold text-gray-900 hover:text-navy-900 cursor-pointer transition-colors line-clamp-2"
            onClick={handleArticleClick}
          >
            {article.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3">
            {article.excerpt}
          </p>
          
          {showSponsorButton && (
            <button 
              onClick={() => setSponsorModalOpen(true)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
            >
              <DollarSign className="h-4 w-4" />
              <span>Sponsor this Investigation</span>
            </button>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{article.publishDate}</span>
              </div>
            </div>
            
            <ShareButton article={article} />
          </div>
        </div>
      </article>

      <DonationModal
        isOpen={sponsorModalOpen}
        onClose={() => setSponsorModalOpen(false)}
        type="sponsorship"
        investigationTitle={article.title}
      />

      <ArticleModal
        article={article}
        isOpen={articleModalOpen}
        onClose={() => setArticleModalOpen(false)}
      />
    </>
  );
};

export default ArticleCard;
