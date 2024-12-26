"use client";

import {
  getEmployeeOverview,
  getTeamMembers,
  getTeamSkills,
} from "@/services/dashboardService";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { 
  TeamOutlined, 
  RiseOutlined, 
  TrophyOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { Card, Button } from 'antd';
import { useRouter } from 'next/navigation';

const COLORS = ["#22c55e", "#eab308"];

interface TeamMember {
  id: string;
  employeeName: string;
  designation: string;
  skillNames: string;
  skillAssessments: [];
}

interface Skill {
  skillName: string;
  currentLevel: number;
  expectedLevel: number;
  certificationName: string | null;
  certificationUrl: string | null;
  progressPercentage: number;
}

interface TeamSkill {
  skillId: string;
  skillName: string;
  usersCount: number;
}

interface Ticket {
  id: string;
  queryType: string;
  description: string;
  status: string;
  createdAt: string;
}

interface EmployeeOverview {
  skills: Skill[];
  tickets: Ticket[];
  progress: {
    totalSkills: number;
    completedSkills: number;
    inProgressSkills: number;
  };
}

export default function ManagerDashboard() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamSkills, setTeamSkills] = useState<TeamSkill[]>([]);
  const [overview, setOverview] = useState<EmployeeOverview | null>(null);
  const [teamOverview] = useState({
    totalSkills: 50,
    completedSkills: 30,
    inProgressSkills: 20,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersResponse, skillsResponse, employeeOverview] =
        await Promise.all([
          getTeamMembers(),
          getTeamSkills(),
          getEmployeeOverview(),
        ]);

      setTeamMembers(membersResponse);
      setTeamSkills(skillsResponse);
      setOverview(employeeOverview);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <main className="py-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <TeamOutlined className="text-2xl text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Team Members</div>
              <div className="text-2xl font-semibold">{teamMembers.length}</div>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <TrophyOutlined className="text-2xl text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Total Skills</div>
              <div className="text-2xl font-semibold">{teamSkills.length}</div>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <RiseOutlined className="text-2xl text-yellow-600" />
            <div>
              <div className="text-sm text-gray-600">Completion Rate</div>
              <div className="text-2xl font-semibold">
                {Math.round((teamOverview.completedSkills / teamOverview.totalSkills) * 100)}%
              </div>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <CustomerServiceOutlined className="text-2xl text-purple-600" />
            <div>
              <div className="text-sm text-gray-600">Open Tickets</div>
              <div className="text-2xl font-semibold">{overview?.tickets.filter(t => t.status === 'open').length || 0}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-sm h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <RiseOutlined className="text-blue-600" />
                Team Progress Overview
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Skills</p>
                <p className="text-2xl font-bold text-gray-800">
                  {teamOverview.totalSkills}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-800">
                  {teamOverview.completedSkills}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-sm text-yellow-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {teamOverview.inProgressSkills}
                </p>
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Completed", value: teamOverview.completedSkills },
                      { name: "In Progress", value: teamOverview.inProgressSkills },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent Support Tickets */}
        <Card className="shadow-sm h-[500px] overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CustomerServiceOutlined className="text-purple-600" />
              Recent Tickets
            </h3>
            <Button type="link" onClick={() => router.push('/helpdesk')}>
              View All
            </Button>
          </div>
          
          <div className="space-y-4 overflow-y-auto h-[420px] pr-2">
            {overview?.tickets.slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {ticket.queryType}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs capitalize
                    ${ticket.status === "open" 
                      ? "bg-yellow-100 text-yellow-800" 
                      : "bg-green-100 text-green-800"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {ticket.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
