
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { updateStatus, deleteRecord, getStatusBadgeVariant, TableName } from '../utils/adminUtils';
import { useToast } from '@/hooks/use-toast';
import { Eye, Trash2, Mail } from 'lucide-react';

interface AdminContactsTabProps {
  contactSubmissions?: any[];
  refetchContacts: () => void;
}

const AdminContactsTab: React.FC<AdminContactsTabProps> = ({ contactSubmissions, refetchContacts }) => {
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await updateStatus('contact_submissions' as TableName, id, status);

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
      refetchContacts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;

    const { error } = await deleteRecord('contact_submissions' as TableName, id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete contact submission",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Contact submission deleted successfully"
      });
      refetchContacts();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Submissions</CardTitle>
        <CardDescription>Manage contact form submissions from users</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactSubmissions?.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.name}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.subject}</TableCell>
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
                          onClick={() => setSelectedContact(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedContact?.subject}</DialogTitle>
                          <DialogDescription>
                            From {selectedContact?.name} ({selectedContact?.email}) on {new Date(selectedContact?.created_at).toLocaleDateString()}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedContact && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold">Message:</h4>
                              <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(submission.id, submission.status === 'unread' ? 'read' : 'completed')}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(submission.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminContactsTab;
