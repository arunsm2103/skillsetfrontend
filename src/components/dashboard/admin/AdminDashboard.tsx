'use client';

import React, { useEffect, useState } from 'react';
import OverviewMetrics from './OverviewMetrics';
import SkillDirectory from './SkillDirectory';
import EmployeeSkillMatrix from './EmployeeSkillMatrix';
import SkillGapAnalytics from './SkillGapAnalytics';
import { getDashboardMetrics } from '@/services/dashboardService';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="py-5 space-y-4">
      {/* Overview Section */}
      <OverviewMetrics metrics={metrics} loading={loading} />

      {/* Skill Directory and Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2">
        <SkillDirectory />
        </div>
        <div className="col-span-1">
        {/* <SkillGapAnalytics  /> */}
        </div>
      </div>

      {/* Employee Skill Matrix */}
      <EmployeeSkillMatrix />
    </div>
  );
};

export default AdminDashboard;
