
-- Create table for investigative reports
CREATE TABLE public.investigative_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  documents_description TEXT,
  urgency_level TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Create table for journalism mentorship applications
CREATE TABLE public.mentorship_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  age INTEGER,
  education_background TEXT NOT NULL,
  journalism_experience TEXT,
  areas_of_interest TEXT NOT NULL,
  motivation TEXT NOT NULL,
  portfolio_links TEXT,
  availability TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable RLS for both tables (making them publicly accessible for form submissions)
ALTER TABLE public.investigative_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_applications ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anyone to insert data (for public forms)
CREATE POLICY "Anyone can submit investigative reports" 
  ON public.investigative_reports 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can submit mentorship applications" 
  ON public.mentorship_applications 
  FOR INSERT 
  WITH CHECK (true);

-- Create policies to allow reading (for admin purposes later)
CREATE POLICY "Anyone can view investigative reports" 
  ON public.investigative_reports 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can view mentorship applications" 
  ON public.mentorship_applications 
  FOR SELECT 
  USING (true);
