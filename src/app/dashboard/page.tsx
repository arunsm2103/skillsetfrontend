'use client';
import EmployeeDashboard from '@/components/dashboard/employee/EmployeeDashboard';
import ManagerDashboard from '@/components/dashboard/manager/ManagerDashboard';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const {activeDashboard} = useAuth();
  return (
    <div className="min-h-screen">
      {/* Dashboard Content */}
      <div>
        {activeDashboard === 'employee' && <EmployeeDashboard />}
        {activeDashboard === 'manager' && <ManagerDashboard />}
        {activeDashboard === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
}
