import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Check, AlertCircle, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const ExclusiveSourceForm: React.FC = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      // Check file size (max 100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 100MB",
          variant: "destructive"
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setFile(null);
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(false);

    try {
      let fileUrl = null;

      // Upload file if provided
      if (file) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `${fileName}`;

          // Upload to the bucket
          const { error: uploadError, data } = await supabase.storage
            .from('exclusive-sources')
            .upload(filePath, file);

          if (uploadError) throw uploadError;
          
          fileUrl = filePath;
        } catch (uploadError: any) {
          console.error('File upload error:', uploadError);
          // Continue with form submission even if file upload fails
          toast({
            title: "File upload failed",
            description: "Your tip will be submitted without the file attachment.",
            variant: "destructive"
          });
        }
      }

      // Submit form data
      const { error } = await supabase
        .from('exclusive_source_submissions')
        .insert({
          title,
          message,
          file_url: fileUrl
        });

      if (error) throw error;

      // Success
      setSubmitSuccess(true);
      resetForm();
      toast({
        title: "Submission successful",
        description: "Your information has been submitted anonymously.",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(true);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-t-lg py-4">
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-indigo-400" />
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-center">Submit Anonymous Tip</CardTitle>
        <CardDescription className="text-slate-300 text-center mt-1 text-sm">
          Share confidential information securely and anonymously. Your identity is protected.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-3 px-4">
        <div className="flex items-center justify-center space-x-4 mb-4 px-3 py-2 bg-indigo-50 rounded-lg">
          <div className="flex items-center text-xs text-indigo-800">
            <Lock className="h-3 w-3 mr-1 text-indigo-600" />
            <span>No IP tracking</span>
          </div>
          <div className="flex items-center text-xs text-indigo-800">
            <EyeOff className="h-3 w-3 mr-1 text-indigo-600" />
            <span>No cookies</span>
          </div>
          <div className="flex items-center text-xs text-indigo-800">
            <Shield className="h-3 w-3 mr-1 text-indigo-600" />
            <span>Complete anonymity</span>
          </div>
        </div>

        {submitSuccess ? (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Check className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">Submission Successful</AlertTitle>
            <AlertDescription className="text-green-700">
              Thank you for your submission. Your information has been received anonymously.
            </AlertDescription>
          </Alert>
        ) : submitError ? (
          <Alert className="mb-6 bg-red-50 border-red-200" variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Submission Failed</AlertTitle>
            <AlertDescription>
              There was an error processing your submission. Please try again later.
            </AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title" className="text-sm">Title</Label>
            <Input 
              id="title" 
              placeholder="Brief title for your submission" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-9"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="message" className="text-sm">Message</Label>
            <Textarea 
              id="message" 
              placeholder="Provide details about your information..." 
              className="min-h-[100px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="file-upload" className="text-sm">Upload File (Optional)</Label>
            <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-lg p-3 text-center hover:bg-indigo-50 transition-colors">
              <Input 
                id="file-upload" 
                type="file" 
                className="hidden"
                onChange={handleFileChange}
              />
              <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-1">
                <Upload className="h-6 w-6 text-indigo-500" />
                <span className="text-xs font-medium text-indigo-700">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </span>
                <span className="text-xs text-indigo-600">
                  Images, videos, or documents (max 100MB)
                </span>
              </Label>
            </div>
          </div>
          
          <div className="bg-slate-900 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <Lock className="h-4 w-4 text-indigo-400 mr-2" />
              <h4 className="text-white font-medium text-sm">Our Privacy Commitment</h4>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Your submission is completely anonymous. We do not:
            </p>
            <ul className="text-xs text-slate-300 space-y-0.5 list-disc pl-5">
              <li>Track your IP address</li>
              <li>Store your location data</li>
              <li>Use cookies to identify you</li>
              <li>Require any personal information</li>
            </ul>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Anonymously'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExclusiveSourceForm;
