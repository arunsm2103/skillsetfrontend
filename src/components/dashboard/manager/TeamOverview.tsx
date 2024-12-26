'use client';

import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Select, Input } from 'antd';
import { TeamOutlined, UserOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { getTeamMembers, updateTeamMemberSkill } from '@/services/dashboardService';
import { showToast } from '@/utils/toast';
import { useRouter } from 'next/navigation';

const { Option } = Select;
const { Search } = Input;

interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  expectedLevel: string;
}

interface SkillAssessment {
  id: string;
  userId: string;
  skillId: string;
  currentLevel: string;
  expectedLevel: string;
  status: string;
  feedback: string | null;
  certificationName: string | null;
  certificationUrl: string | null;
  assessmentDate: string;
  skill: Skill;
}

interface TeamMember {
  id: string;
  employeeCode: string;
  employeeName: string;
  businessUnit: string;
  department: string;
  officialEmail: string;
  designation: string;
  gender: string;
  role: string;
  dateOfJoining: string;
  isActive: boolean;
  skillAssessments: SkillAssessment[];
  skillNames: string;
}

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const TeamOverview = () => {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [updatingSkill, setUpdatingSkill] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchText, teamMembers]);

  const filterMembers = () => {
    const filtered = teamMembers.filter(member => 
      member.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchText.toLowerCase()) ||
      member.department.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  const fetchTeamMembers = async () => {
    try {
      const data = await getTeamMembers();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpectedLevelChange = async (skillId: string, newLevel: string) => {
    if (!selectedMember) return;
    
    try {
      setUpdatingSkill(true);
      await updateTeamMemberSkill(selectedMember.id, skillId, newLevel);
      showToast.success('Skill level updated successfully');
      await fetchTeamMembers();
      
      const updatedMember = teamMembers.find(m => m.id === selectedMember.id);
      if (updatedMember) {
        setSelectedMember(updatedMember);
      }
    } catch (error) {
      showToast.error('Failed to update skill level');
    } finally {
      setUpdatingSkill(false);
    }
  };

  const handleGenerateReport = (memberId: string) => {
    router.push(`/reports/user/${memberId}`);
  };

  const getLevelColor = (currentLevel: string, expectedLevel: string) => {
    const levels = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
    const current = levels[currentLevel as keyof typeof levels];
    const expected = levels[expectedLevel as keyof typeof levels];
    
    if (current < expected) return 'text-red-500';
    if (current > expected) return 'text-emerald-500';
    return 'text-blue-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Team and Skills Management</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <Card className="shadow-lg h-[700px] border-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TeamOutlined className="text-blue-600 text-xl" />
                  <h3 className="text-lg font-bold text-gray-800">Team Members</h3>
                </div>
              </div>

              <Search
                placeholder="Search by name, role, or department"
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                className="mb-3"
                prefix={<SearchOutlined className="text-gray-400" />}
              />
              
              <div className="space-y-2 overflow-y-auto h-[500px] pr-2">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedMember?.id === member.id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar 
                        icon={<UserOutlined />} 
                        size="large"
                        className="bg-blue-100 text-blue-600"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{member.employeeName}</h4>
                        <p className="text-sm text-gray-600">{member.designation}</p>
                        <p className="text-xs text-gray-500">{member.department}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedMember ? (
            <Card className="shadow-lg h-[700px] border-0">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <Avatar 
                    icon={<UserOutlined />} 
                    size={64}
                    className="bg-blue-100 text-blue-600"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedMember.employeeName}</h2>
                    <p className="text-gray-600 font-medium">{selectedMember.designation}</p>
                    <p className="text-gray-500">{selectedMember.department}</p>
                  </div>
                </div>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => handleGenerateReport(selectedMember.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Generate Report
                </Button>
              </div>

              <div className="overflow-y-auto h-[500px] pr-2">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-bold text-gray-800">Skills Assessment</h3>
                  <span className="text-gray-500 text-sm">
                    ({selectedMember.skillAssessments.length} skills)
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {selectedMember.skillAssessments.map((assessment) => (
                    <Card key={assessment.id} className="shadow-md border-0">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">{assessment.skill.name}</h4>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                            {assessment.skill.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{assessment.skill.description}</p>
                        <div className="flex items-center gap-3">
                          <span className={`font-medium ${getLevelColor(assessment.currentLevel, assessment.expectedLevel)}`}>
                            Current: {assessment.currentLevel}
                          </span>
                          <span className="text-gray-400">→</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">Expected:</span>
                            <Select
                              value={assessment.expectedLevel}
                              onChange={(value) => handleExpectedLevelChange(assessment.id, value)}
                              size="small"
                              style={{ width: 120 }}
                              loading={updatingSkill}
                              className="text-gray-700"
                            >
                              {SKILL_LEVELS.map(level => (
                                <Option key={level} value={level}>{level}</Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                        {assessment.certificationName && assessment.certificationUrl && (
                          <div className="mt-2 text-sm text-gray-600">
                            Certification: {assessment.certificationName}
                            {assessment.certificationUrl && (
                              <a 
                                href={assessment.certificationUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 hover:text-blue-700 hover:underline"
                              >
                                View Certificate
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="shadow-lg h-[700px] flex items-center justify-center border-0">
              <div className="text-center text-gray-500">
                <UserOutlined className="text-4xl text-gray-400" />
                <p className="mt-3 text-gray-600">Select a team member to view their details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamOverview;