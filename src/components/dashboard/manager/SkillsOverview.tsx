'use client';

import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTeamSkills } from '@/services/dashboardService';

interface TeamSkill {
  skillId: string;
  skillName: string;
  usersCount: number;
  category: string;
}

const SkillsOverview = () => {
  const [skills, setSkills] = useState<TeamSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await getTeamSkills();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    let filteredData = [...skills];
    if (filterType !== 'all') {
      filteredData = filteredData.filter(skill => skill.category === filterType);
    }
    // Sort by user count for better visualization
    return filteredData.sort((a, b) => b.usersCount - a.usersCount).slice(0, 10);
  };
  console.log(getFilteredData(),'kk');

  const CustomTooltip = ({ 
    active, 
    payload, 
    label 
  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded border">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-blue-600">
            {payload[0].value} team members
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="bg-white rounded-xl shadow p-6 h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Skills Distribution
        </h3>
        <Select
          defaultValue="all"
          style={{ width: 150 }}
          onChange={setFilterType}
          options={[
            { value: 'all', label: 'All Skills' },
            { value: 'technical', label: 'Technical' },
            { value: 'soft', label: 'Soft Skills' },
            { value: 'domain', label: 'Domain' },
          ]}
        />
      </div>

      <div className="h-[400px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading skills data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getFilteredData()}
              margin={{
                top: 20,
                right: 30,
                left: 40,
                bottom: 60,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
              />
              <XAxis 
                dataKey="skillName" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ 
                  fill: '#4B5563',
                  fontSize: 12
                }}
              />
              <YAxis 
                tick={{ 
                  fill: '#4B5563',
                  fontSize: 12
                }}
                label={{ 
                  value: 'Team Members', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#4B5563' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="usersCount" 
                fill="#4F46E5"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {!loading && skills.length === 0 && (
        <div className="h-full flex items-center justify-center text-gray-500">
          No skills data available
        </div>
      )}
    </div>
  );
};

export default SkillsOverview;