
import { supabase } from '@/integrations/supabase/client';

export type TableName = 'contact_submissions' | 'investigative_reports' | 'mentorship_applications';

export const updateStatus = async (table: TableName, id: string, status: string) => {
  const { error } = await supabase
    .from(table)
    .update({ status })
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
    'rejected': 'outline'
  };
  
  return variants[status] || 'secondary';
};
