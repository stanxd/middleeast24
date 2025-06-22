import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { updateStatus, deleteRecord, getStatusBadgeVariant, TableName } from '../utils/adminUtils';
import { useToast } from '@/hooks/use-toast';
import { Eye, Trash2, Mail, FileText, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ExclusiveSourceSubmission {
  id: string;
  title: string;
  message: string;
  file_url: string | null;
  status: string;
  created_at: string;
}

interface AdminExclusiveSourcesTabProps {
  exclusiveSourceSubmissions?: ExclusiveSourceSubmission[];
  refetchSubmissions: () => void;
}

const AdminExclusiveSourcesTab: React.FC<AdminExclusiveSourcesTabProps> = ({ 
  exclusiveSourceSubmissions, 
  refetchSubmissions 
}) => {
  const { toast } = useToast();
  const [selectedSubmission, setSelectedSubmission] = useState<ExclusiveSourceSubmission | null>(null);

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await updateStatus('exclusive_source_submissions' as TableName, id, status);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Status updated successfully"
      });
      refetchSubmissions();
    }
  };

  const handleDelete = async (id: string, fileUrl: string | null) => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) return;

    try {
      // First delete the file if it exists
      if (fileUrl) {
        const { error: storageError } = await supabase.storage
          .from('middleeast24-uploads')
          .remove([fileUrl]);
        
        if (storageError) {
          console.error('Error deleting file:', storageError);
          toast({
            title: "Warning",
            description: "Could not delete the associated file, but will proceed with submission deletion.",
            variant: "destructive"
          });
        }
      }

      // Then delete the record
      const { error } = await deleteRecord('exclusive_source_submissions' as TableName, id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete submission",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Submission deleted successfully"
        });
        refetchSubmissions();
      }
    } catch (error) {
      console.error('Error in delete process:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const getPublicUrl = async (path: string) => {
    try {
      const { data } = await supabase.storage
        .from('middleeast24-uploads')
        .getPublicUrl(path);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting public URL:', error);
      return null;
    }
  };

  const openFileInNewTab = async (path: string) => {
    const publicUrl = await getPublicUrl(path);
    if (publicUrl) {
      window.open(publicUrl, '_blank');
    } else {
      toast({
        title: "Error",
        description: "Could not access the file",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exclusive Source Submissions</CardTitle>
        <CardDescription>Anonymous news tips submitted through the exclusive sources form</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Has File</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exclusiveSourceSubmissions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No submissions yet
                </TableCell>
              </TableRow>
            ) : (
              exclusiveSourceSubmissions?.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.title}</TableCell>
                  <TableCell>
                    {submission.file_url ? (
                      <Badge variant="outline" className="bg-blue-50">
                        <FileText className="h-3 w-3 mr-1" />
                        File Attached
                      </Badge>
                    ) : (
                      <span className="text-gray-500 text-sm">No file</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(submission.status)}>
                      {submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{selectedSubmission?.title}</DialogTitle>
                            <DialogDescription>
                              Submitted on {selectedSubmission && new Date(selectedSubmission.created_at).toLocaleString()}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedSubmission && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold">Message:</h4>
                                <p className="text-sm whitespace-pre-wrap">{selectedSubmission.message}</p>
                              </div>
                              
                              {selectedSubmission.file_url && (
                                <div>
                                  <h4 className="font-semibold">Attached File:</h4>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => openFileInNewTab(selectedSubmission.file_url!)}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open File
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(
                          submission.id, 
                          submission.status === 'unread' ? 'read' : 'completed'
                        )}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(submission.id, submission.file_url)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminExclusiveSourcesTab;
