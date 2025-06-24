-- Enable Row Level Security for rss_sources table
ALTER TABLE public.rss_sources ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security for rss_articles table
ALTER TABLE public.rss_articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access to rss_sources
CREATE POLICY "Allow anonymous read access to rss_sources"
ON public.rss_sources
FOR SELECT
TO anon
USING (true);

-- Create policy to allow authenticated users to insert/update/delete rss_sources
CREATE POLICY "Allow authenticated users to manage rss_sources"
ON public.rss_sources
FOR ALL
TO authenticated
USING (true);

-- Create policy to allow anonymous read access to rss_articles
CREATE POLICY "Allow anonymous read access to rss_articles"
ON public.rss_articles
FOR SELECT
TO anon
USING (true);

-- Create policy to allow authenticated users to insert/update/delete rss_articles
CREATE POLICY "Allow authenticated users to manage rss_articles"
ON public.rss_articles
FOR ALL
TO authenticated
USING (true);

-- Create policy to allow service role to manage rss_sources
CREATE POLICY "Allow service role to manage rss_sources"
ON public.rss_sources
FOR ALL
TO service_role
USING (true);

-- Create policy to allow service role to manage rss_articles
CREATE POLICY "Allow service role to manage rss_articles"
ON public.rss_articles
FOR ALL
TO service_role
USING (true);
