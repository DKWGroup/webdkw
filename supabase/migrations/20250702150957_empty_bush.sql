/*
  # Create files storage bucket

  1. Storage Setup
    - Create 'files' storage bucket for file uploads
    - Configure bucket as public for file access
    - Set up appropriate storage policies for uploads and access

  2. Security
    - Allow public read access to uploaded files
    - Allow authenticated users to upload files
    - Restrict file operations to appropriate user roles
*/

-- Create the files storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'files',
  'files',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/png', 
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public read access to files
CREATE POLICY "Public can view files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'files');

-- Policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'files');

-- Policy to allow authenticated users to update their own files
CREATE POLICY "Authenticated users can update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'files');

-- Policy to allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'files');