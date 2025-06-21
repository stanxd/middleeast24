
-- Create articles table for news management
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('News', 'Investigations', 'Exclusive Sources')),
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'hidden', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policies for articles (public can read published articles, authenticated users can manage)
CREATE POLICY "Anyone can view published articles" 
  ON public.articles 
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Authenticated users can manage articles" 
  ON public.articles 
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Update investigative_reports table to add status management
ALTER TABLE public.investigative_reports 
ADD COLUMN IF NOT EXISTS published_article_id UUID REFERENCES public.articles(id);

-- Update contact_submissions table to allow updates
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage contact submissions" 
  ON public.contact_submissions 
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at 
  BEFORE UPDATE ON public.articles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
