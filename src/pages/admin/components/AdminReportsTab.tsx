
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { updateStatus, getStatusBadgeVariant, TableName } from '../utils/adminUtils';
import { useToast } from '@/hooks/use-toast';

interface AdminReportsTabProps {
  investigativeReports?: any[];
  refetchReports: () => void;
}

const AdminReportsTab: React.FC<AdminReportsTabProps> = ({ investigativeReports, refetchReports }) => {
  const { toast } = useToast();

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await updateStatus('investigative_reports' as TableName, id, status);

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
      refetchReports();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investigative Reports</CardTitle>
        <CardDescription>Review and manage investigative report submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investigativeReports?.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.title}</TableCell>
                <TableCell>{report.contact_name}</TableCell>
                <TableCell>
                  <Badge variant={report.urgency_level === 'high' ? 'destructive' : 'secondary'}>
                    {report.urgency_level}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(report.status)}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(report.id, 'reviewed')}
                    >
                      Mark Reviewed
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

export default AdminReportsTab;
