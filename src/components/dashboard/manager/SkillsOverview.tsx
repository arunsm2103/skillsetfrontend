'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { BarChartOutlined, EyeOutlined } from '@ant-design/icons';
import { getTeamSkills } from '@/services/dashboardService';

interface TeamSkill {
  skillId: string;
  skillName: string;
  usersCount: number;
}

const SkillsOverview = () => {
  const [skills, setSkills] = useState<TeamSkill[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Skills Overview</h1>
      <div className="bg-white rounded-xl shadow p-6 h-[500px] col-span-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChartOutlined className="text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold text-black">
                    Skills Overview
                  </h3>
                </div>
              </div>

              <div className="h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-3 text-black">Skill</th>
                      <th className="pb-3 text-black">Count</th>
                      <th className="pb-3 text-black">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills?.map((skill) => (
                      <tr key={skill.skillId} className="border-t">
                        <td className="py-3 text-black">{skill.skillName}</td>
                        <td className="py-3 text-black">{skill.usersCount}</td>
                        <td className="py-3 text-black">
                          <button className="text-blue-600 hover:text-blue-800">
                            <EyeOutlined />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
    </div>
  );
};

export default SkillsOverview;