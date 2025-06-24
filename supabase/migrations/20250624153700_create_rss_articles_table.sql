-- Create the rss_articles table
CREATE TABLE IF NOT EXISTS public.rss_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT NOT NULL,
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL,
  source_url TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  sentiment_label TEXT CHECK (sentiment_label IN ('positive', 'negative', 'neutral')),
  sentiment_confidence NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Composite unique constraint to prevent duplicates
  UNIQUE(title, source_url, publish_date)
);

-- Add RLS policies
ALTER TABLE public.rss_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to rss_articles" 
  ON public.rss_articles 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to insert/update
CREATE POLICY "Allow authenticated users to insert rss_articles" 
  ON public.rss_articles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update rss_articles" 
  ON public.rss_articles 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update updated_at
CREATE TRIGGER update_rss_articles_updated_at
BEFORE UPDATE ON public.rss_articles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
