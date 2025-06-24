
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ExternalLink, Clock, User } from 'lucide-react';
import { Article } from '../types/Article';
import ShareButton from './ShareButton';

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, isOpen, onClose }) => {
  if (!article) return null;

  const handleExternalLink = () => {
    // Try to extract and open external link
    if (article.content.includes('http')) {
      const urlMatch = article.content.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        window.open(urlMatch[0], '_blank');
        return;
      }
    }
  };

  const hasExternalLink = article.content.includes('http');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                  {article.category}
                </span>
                {hasExternalLink && (
                  <button
                    onClick={handleExternalLink}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Read Original</span>
                  </button>
                )}
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-left leading-tight">
                {article.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Article Image */}
          <div className="relative">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-48 sm:h-64 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 p-1 rounded">
              <img 
                src="/lovable-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png" 
                alt="ME24 Logo" 
                className="h-4 w-4 opacity-70"
              />
            </div>
          </div>

          {/* Article Meta */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 border-b pb-3">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{article.publishDate}</span>
            </div>
          </div>

          {/* Article Excerpt */}
          {article.excerpt && (
            <div className="text-lg text-gray-700 leading-relaxed font-medium">
              {article.excerpt}
            </div>
          )}

          {/* Article Content */}
          <div className="prose max-w-none">
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: article.content.replace(/<[^>]*>/g, '').replace(/\n/g, '<br />') 
              }}
            />
          </div>

          {/* Call to Action */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <ShareButton 
                article={article} 
                className="flex items-center space-x-2 text-navy-900 hover:text-navy-700"
              />
              
              {hasExternalLink && (
                <button
                  onClick={handleExternalLink}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Read Original</span>
                </button>
              )}
            </div>
            
            {hasExternalLink && (
              <button
                onClick={handleExternalLink}
                className="w-full bg-navy-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-800 transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Read Full Article on Original Source</span>
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleModal;
