
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: 'News' | 'Investigations' | 'Exclusive Sources';
  publishDate: string;
  image: string;
  featured: boolean;
  tags: string[];
}
