-- Create exclusive_source_submissions table
CREATE TABLE IF NOT EXISTS public.exclusive_source_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up RLS (Row Level Security)
ALTER TABLE public.exclusive_source_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous submissions (anyone can insert)
CREATE POLICY "Allow anonymous submissions" 
  ON public.exclusive_source_submissions
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Create policy for admin access (only authenticated users can select/update/delete)
CREATE POLICY "Allow admin access" 
  ON public.exclusive_source_submissions
  FOR ALL 
  TO authenticated
  USING (true);

-- Add table to public schema
GRANT ALL ON public.exclusive_source_submissions TO anon, authenticated;
