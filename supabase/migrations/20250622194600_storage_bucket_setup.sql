-- Create storage bucket for exclusive sources if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('exclusive-sources', 'exclusive-sources', false)
ON CONFLICT (id) DO NOTHING;

-- Allow anonymous users to upload files to the bucket
CREATE POLICY "Allow anonymous uploads" 
ON storage.objects
FOR INSERT 
TO anon
WITH CHECK (
  bucket_id = 'exclusive-sources'
);

-- Allow authenticated users to manage all files
CREATE POLICY "Allow authenticated users to manage files" 
ON storage.objects
FOR ALL 
TO authenticated
USING (
  bucket_id = 'exclusive-sources'
);

-- Allow anonymous users to read their own uploaded files
CREATE POLICY "Allow anonymous users to read their own files" 
ON storage.objects
FOR SELECT 
TO anon
USING (
  bucket_id = 'exclusive-sources'
);
