'use client';

import { useAuth } from '@/contexts/AuthContext';
import AdminHelpDesk from '@/components/helpdesk/AdminHelpDesk';
import EmployeeHelpDesk from '@/components/helpdesk/EmployeeHelpDesk';

export default function Page() {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <AdminHelpDesk />;
  }
  
  return <EmployeeHelpDesk />;
}