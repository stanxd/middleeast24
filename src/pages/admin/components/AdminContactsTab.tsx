
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { updateStatus, getStatusBadgeVariant, TableName } from '../utils/adminUtils';
import { useToast } from '@/hooks/use-toast';

interface AdminContactsTabProps {
  contactSubmissions?: any[];
  refetchContacts: () => void;
}

const AdminContactsTab: React.FC<AdminContactsTabProps> = ({ contactSubmissions, refetchContacts }) => {
  const { toast } = useToast();

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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(submission.id, 'read')}
                    >
                      Mark Read
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
