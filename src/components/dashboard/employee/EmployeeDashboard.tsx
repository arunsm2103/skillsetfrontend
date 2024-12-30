"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getAllSkills, getEmployeeOverview, getSkillDirectory, MasterSkill } from "@/services/dashboardService";
import { getUser } from "@/services/userService";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SkillForm from "@/components/SkillForm";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addSkillAssessment } from "@/services/skillService";

const COLORS = ["#22c55e", "#eab308"];
interface SkillOverview {
  skillName: string;
  currentLevel: number;
  expectedLevel: number;
  certificationName: string | null;
  certificationUrl: string | null;
  progressPercentage: number;
}

interface Ticket {
  id: string;
  queryType: string;
  description: string;
  status: string;
  createdAt: string;
}

interface EmployeeOverview {
  skills: SkillOverview[];
  tickets: Ticket[];
  progress: {
    totalSkills: number;
    completedSkills: number;
    inProgressSkills: number;
  };
}
interface UserProfile {
  employeeCode: string;
  employeeName: string;
  businessUnit: string;
  designation: string;
  dateOfJoining: string;
  department: string;
  officialEmail: string;
  reportingManager: {
    employeeName: string;
    designation: string;
  };
}

interface SkillFormData {
  skillId: string;
  currentLevel: string;
  certificationName: string;
  certificationUrl: string;
}

export default function EmployeeDashboard() {
  const [overview, setOverview] = useState<EmployeeOverview | null>(null);
  const [Profile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<MasterSkill[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [overviewResponse, userDataResponse] = await Promise.all([
        getEmployeeOverview(),
        getUser(user?.id as string)
      ]);
      setOverview(overviewResponse);
      setUserProfile(userDataResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to refresh dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAvailableSkills();
  }, []);

  const fetchAvailableSkills = async () => {
    try {
      const skills = await getAllSkills();
      setAvailableSkills(skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      message.error('Failed to fetch available skills');
    }
  };

  const handleAddSkill = async (formData: SkillFormData) => {
    setLoading(true);
    try {
      await addSkillAssessment(formData);
      message.success('Skill assessment added successfully');
      setShowSkillModal(false);
      // Refetch all dashboard data
      await fetchDashboardData();
    } catch (error) {
      message.error('Failed to add skill assessment');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <main className="py-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow p-6 h-[500px] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="text-blue-600 text-xl">💡</div>
                <h3 className="text-lg font-semibold text-black">
                  My Acquired Skills
                </h3>
              </div>
              <Button 
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowSkillModal(true)}
              >
                Add Skill
              </Button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-3 text-black">Skill Name</th>
                  <th className="pb-3 text-black">Current Level</th>
                  <th className="pb-3 text-black">Manager Rating</th>
                  <th className="pb-3 text-black">Certification</th>
                </tr>
              </thead>
              <tbody>
                {overview?.skills.map((skill, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 text-black">{skill.skillName}</td>
                    <td className="py-3">
                      <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {skill?.currentLevel}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {skill?.expectedLevel}
                      </span>
                    </td>
                    <td className="py-3">
                      {skill.certificationName && (
                        <a
                          href={skill.certificationUrl || "#"}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {skill.certificationName}
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow p-6 h-[500px]">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-blue-600 text-xl">📊</div>
              <h3 className="text-lg font-semibold text-black">
                Skills Progress Overview
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Skills</p>
                <p className="text-2xl font-bold text-gray-800">
                  {overview?.progress.totalSkills}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-800">
                  {overview?.progress.completedSkills}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-sm text-yellow-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {overview?.progress.inProgressSkills}
                </p>
              </div>
            </div>

            <div className="h-full">
              <ResponsiveContainer width="100%" height="100%" maxHeight={350}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Completed",
                        value: overview?.progress.completedSkills || 0,
                      },
                      {
                        name: "In Progress",
                        value: overview?.progress.inProgressSkills || 0,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
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
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    payload={[
                      { value: "Completed", type: "circle", color: COLORS[0] },
                      {
                        value: "In Progress",
                        type: "circle",
                        color: COLORS[1],
                      },
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow overflow-hidden h-[500px]">
            <div className="p-6 bg-blue-600 text-center">
              <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-white">
                {Profile?.employeeName}
              </h3>
              <p className="text-blue-100">{Profile?.designation}</p>
            </div>
            <div className="p-4 space-y-2 overflow-y-auto">
              <p className="text-black">
                <span className="font-medium">Employee Code:</span>{" "}
                {Profile?.employeeCode}
              </p>
              <p className="text-black">
                <span className="font-medium">Employee Name:</span>{" "}
                {Profile?.employeeName}
              </p>
              <p className="text-black">
                <span className="font-medium">Business Unit:</span>{" "}
                {Profile?.businessUnit}
              </p>
              <p className="text-black">
                <span className="font-medium">Department:</span>{" "}
                {Profile?.department}
              </p>
              <p className="text-black">
                <span className="font-medium">Email:</span>{" "}
                {Profile?.officialEmail}
              </p>
              <p className="text-black">
                <span className="font-medium">Reporting Manager:</span>{" "}
                {Profile?.reportingManager?.employeeName}
              </p>
              <p className="text-black">
                <span className="font-medium">Manager Designation:</span>{" "}
                {Profile?.reportingManager?.designation}
              </p>
              <p className="text-black">
                <span className="font-medium">DOJ:</span>{" "}
                {Profile?.dateOfJoining}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 h-[500px] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Support Tickets
            </h3>
            <div className="space-y-4">
              {overview?.tickets.map((ticket) => (
                <div key={ticket.id} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-black">
                      {ticket.queryType}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm capitalize ${
                        ticket.status === "open"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{ticket.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showSkillModal && (
        <SkillForm
          availableSkills={availableSkills}
          onSubmit={handleAddSkill}
          onCancel={() => setShowSkillModal(false)}
          loading={loading}
        />
      )}
    </main>
  );
}
