
-- Update policies for contact_submissions to allow authenticated users to update status
DROP POLICY IF EXISTS "Authenticated users can manage contact submissions" ON public.contact_submissions;

CREATE POLICY "Authenticated users can manage contact submissions" 
  ON public.contact_submissions 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Update policies for investigative_reports to allow authenticated users to update status  
DROP POLICY IF EXISTS "Anyone can view investigative reports" ON public.investigative_reports;
DROP POLICY IF EXISTS "Anyone can submit investigative reports" ON public.investigative_reports;

CREATE POLICY "Anyone can submit investigative reports" 
  ON public.investigative_reports 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage investigative reports" 
  ON public.investigative_reports 
  FOR ALL 
  USING (true)
  WITH CHECK (true);
