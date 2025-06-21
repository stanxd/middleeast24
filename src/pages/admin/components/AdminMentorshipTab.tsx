
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { updateStatus, getStatusBadgeVariant, TableName } from '../utils/adminUtils';
import { useToast } from '@/hooks/use-toast';

interface AdminMentorshipTabProps {
  mentorshipApplications?: any[];
  refetchApplications: () => void;
}

const AdminMentorshipTab: React.FC<AdminMentorshipTabProps> = ({ mentorshipApplications, refetchApplications }) => {
  const { toast } = useToast();

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await updateStatus('mentorship_applications' as TableName, id, status);

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
      refetchApplications();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentorship Applications</CardTitle>
        <CardDescription>Review and manage mentorship program applications</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentorshipApplications?.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">{application.full_name}</TableCell>
                <TableCell>{application.email}</TableCell>
                <TableCell>{application.program_type}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(application.status)}>
                    {application.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(application.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(application.id, 'rejected')}
                    >
                      Reject
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

export default AdminMentorshipTab;
