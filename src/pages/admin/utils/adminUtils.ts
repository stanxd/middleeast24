
import { supabase } from '@/integrations/supabase/client';

export type TableName = 'contact_submissions' | 'investigative_reports' | 'mentorship_applications' | 'articles' | 'exclusive_source_submissions';

export const updateStatus = async (table: TableName, id: string, status: string) => {
  const { error } = await supabase
    .from(table)
    .update({ status })
    .eq('id', id);

  return { error };
};

export const deleteRecord = async (table: TableName, id: string) => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  return { error };
};

export const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'unread': 'destructive',
    'pending': 'secondary',
    'read': 'default',
    'completed': 'default',
    'approved': 'default',
    'rejected': 'outline',
    'draft': 'secondary',
    'published': 'default',
    'hidden': 'outline',
    'archived': 'destructive'
  };
  
  return variants[status] || 'secondary';
};

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: 'News' | 'Investigations' | 'Exclusive Sources';
  publish_date: string;
  image_url?: string;
  featured: boolean;
  tags?: string[];
  status: 'draft' | 'published' | 'hidden' | 'archived';
  created_at: string;
  updated_at: string;
}
