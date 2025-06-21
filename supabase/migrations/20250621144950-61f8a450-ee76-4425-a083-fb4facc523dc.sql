
-- Add program_type column to mentorship_applications table
ALTER TABLE public.mentorship_applications 
ADD COLUMN program_type TEXT NOT NULL DEFAULT 'ME24 Media';

-- Add expert_name column for Expert 1:1 selections
ALTER TABLE public.mentorship_applications 
ADD COLUMN expert_name TEXT;

-- Add hourly_rate column to track the rate based on program type
ALTER TABLE public.mentorship_applications 
ADD COLUMN hourly_rate INTEGER;

-- Add max_hours_monthly column for Expert 1:1 programs
ALTER TABLE public.mentorship_applications 
ADD COLUMN max_hours_monthly INTEGER;
