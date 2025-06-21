import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import AdminStats from './admin/components/AdminStats';
import AdminContactsTab from './admin/components/AdminContactsTab';
import AdminReportsTab from './admin/components/AdminReportsTab';
import AdminMentorshipTab from './admin/components/AdminMentorshipTab';
import AdminArticlesTab from './admin/components/AdminArticlesTab';
import { Article } from './admin/utils/adminUtils';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been successfully signed out.',
    });
  };

  // Fetch contact submissions
  const { data: contactSubmissions, refetch: refetchContacts } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch investigative reports
  const { data: investigativeReports, refetch: refetchReports } = useQuery({
    queryKey: ['investigative-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investigative_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch mentorship applications
  const { data: mentorshipApplications, refetch: refetchApplications } = useQuery({
    queryKey: ['mentorship-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentorship_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch articles
  const { data: articles, refetch: refetchArticles } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Article[];
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="text-center flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Admin <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-700 via-[#0003ff] to-slate-900">Dashboard</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-br from-slate-700 via-[#0003ff] to-slate-900 mx-auto mb-8"></div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          <AdminStats 
            contactSubmissions={contactSubmissions}
            investigativeReports={investigativeReports}
            mentorshipApplications={mentorshipApplications}
            articles={articles}
          />

          <Tabs defaultValue="articles" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="contacts">Contact Submissions</TabsTrigger>
              <TabsTrigger value="reports">Investigative Reports</TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship Applications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="articles">
              <AdminArticlesTab 
                articles={articles}
                refetchArticles={refetchArticles}
              />
            </TabsContent>
            
            <TabsContent value="contacts">
              <AdminContactsTab 
                contactSubmissions={contactSubmissions}
                refetchContacts={refetchContacts}
              />
            </TabsContent>
            
            <TabsContent value="reports">
              <AdminReportsTab 
                investigativeReports={investigativeReports}
                refetchReports={refetchReports}
              />
            </TabsContent>
            
            <TabsContent value="mentorship">
              <AdminMentorshipTab 
                mentorshipApplications={mentorshipApplications}
                refetchApplications={refetchApplications}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
