
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { updateStatus, deleteRecord, getStatusBadgeVariant, TableName } from '../utils/adminUtils';
import { useToast } from '@/hooks/use-toast';
import { Eye, Trash2, FileText } from 'lucide-react';

interface AdminReportsTabProps {
  investigativeReports?: any[];
  refetchReports: () => void;
}

const AdminReportsTab: React.FC<AdminReportsTabProps> = ({ investigativeReports, refetchReports }) => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<any>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    const { error } = await deleteRecord('investigative_reports' as TableName, id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Report deleted successfully"
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
                <TableCell>
                  <div>
                    <div className="font-medium">{report.contact_name}</div>
                    <div className="text-sm text-muted-foreground">{report.contact_email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={report.urgency_level === 'high' ? 'destructive' : report.urgency_level === 'medium' ? 'secondary' : 'outline'}>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{selectedReport?.title}</DialogTitle>
                          <DialogDescription>
                            Submitted by {selectedReport?.contact_name} on {new Date(selectedReport?.created_at).toLocaleDateString()}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedReport && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold">Description:</h4>
                              <p className="text-sm">{selectedReport.description}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Contact Information:</h4>
                              <p className="text-sm">Name: {selectedReport.contact_name}</p>
                              <p className="text-sm">Email: {selectedReport.contact_email}</p>
                              {selectedReport.contact_phone && (
                                <p className="text-sm">Phone: {selectedReport.contact_phone}</p>
                              )}
                            </div>
                            {selectedReport.documents_description && (
                              <div>
                                <h4 className="font-semibold">Documents:</h4>
                                <p className="text-sm">{selectedReport.documents_description}</p>
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold">Urgency Level:</h4>
                              <Badge variant={selectedReport.urgency_level === 'high' ? 'destructive' : selectedReport.urgency_level === 'medium' ? 'secondary' : 'outline'}>
                                {selectedReport.urgency_level}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(report.id, report.status === 'pending' ? 'reviewed' : 'completed')}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(report.id)}
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

export default AdminReportsTab;
