-- Create the rss_sources table
CREATE TABLE IF NOT EXISTS public.rss_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('News', 'Investigations', 'Exclusive Sources')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Unique constraint to prevent duplicates
  UNIQUE(url)
);

-- Add RLS policies
ALTER TABLE public.rss_sources ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to rss_sources" 
  ON public.rss_sources 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert rss_sources" 
  ON public.rss_sources 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update rss_sources" 
  ON public.rss_sources 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete rss_sources" 
  ON public.rss_sources 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update updated_at
CREATE TRIGGER update_rss_sources_updated_at
BEFORE UPDATE ON public.rss_sources
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default RSS sources
INSERT INTO public.rss_sources (name, url, category)
VALUES 
  ('Al Jazeera', 'https://www.aljazeera.com/xml/rss/all.xml', 'News'),
  ('BBC Middle East', 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', 'News'),
  ('Reuters Middle East', 'https://www.reutersagency.com/feed/?taxonomy=best-regions&post_type=best&taxonomy=best-regions&post_type=best&best-regions=middle-east', 'News'),
  ('Al Arabiya', 'https://english.alarabiya.net/tools/rss', 'News')
ON CONFLICT (url) DO NOTHING;
