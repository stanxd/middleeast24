
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, FileText, Users } from 'lucide-react';

interface AdminStatsProps {
  contactSubmissions?: any[];
  investigativeReports?: any[];
  mentorshipApplications?: any[];
}

const AdminStats: React.FC<AdminStatsProps> = ({
  contactSubmissions,
  investigativeReports,
  mentorshipApplications
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{contactSubmissions?.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            {contactSubmissions?.filter(c => c.status === 'unread').length || 0} unread
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Investigative Reports</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{investigativeReports?.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            {investigativeReports?.filter(r => r.status === 'pending').length || 0} pending
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mentorship Applications</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mentorshipApplications?.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            {mentorshipApplications?.filter(a => a.status === 'pending').length || 0} pending
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
