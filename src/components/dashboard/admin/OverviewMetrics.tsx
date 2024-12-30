import React from 'react';
import { Card } from 'antd';

interface OverviewMetricsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metrics: any;
  loading: boolean;
}

const OverviewMetrics = ({ metrics }: OverviewMetricsProps) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
        <Card className="shadow-sm">
          <div className="text-sm text-gray-600">Total Employees</div>
          <div className="text-2xl font-semibold mt-2">{metrics?.totalEmployees}</div>
        </Card>
    
        <Card className="shadow-sm">
          <div className="text-sm text-gray-600">Total Skills</div>
          <div className="text-2xl font-semibold mt-2">{metrics?.totalSkills}</div>
        </Card>
        <Card className="shadow-sm">
          <div className="text-sm text-gray-600">Meeting Expectations (%)</div>
          <div className="text-2xl font-semibold mt-2">{metrics?.percentageMeetingExpectations}</div>
        </Card>
        <Card className="shadow-sm">
          <div className="text-sm text-gray-600">Departments</div>
          <div className="text-2xl font-semibold mt-2">{metrics?.totalBusinessUnits}</div>
        </Card>
    </div>
  );
};

export default OverviewMetrics; 