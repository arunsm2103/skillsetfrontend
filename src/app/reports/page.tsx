'use client';

import React, { useState } from 'react';
import { useAuth, useRole } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface PersonalInfo {
  name: string;
  designation: string;
  department: string;
  reportingManager: string;
  doj: string;
  svmExperience: string;
  externalExperience: string;
  businessUnit: string;
}

interface SkillInfo {
  skillName: string;
  grade: string;
  remarks: string;
}

export default function Reports() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect if not manager
  React.useEffect(() => {
    if (user?.role !== 'manager') {
      router.push('/dashboard');
    }
  }, [user?.role, router]);

  const personalInfo: PersonalInfo = {
    name: 'Abcdefgh',
    designation: 'Developer',
    department: 'SONATA',
    reportingManager: 'Lorem Ipsum',
    doj: 'DD/MM/YYYY',
    svmExperience: '12 Years',
    externalExperience: '6 Years',
    businessUnit: 'Shipping'
  };

  const skills: SkillInfo[] = [
    { skillName: 'Java', grade: 'AAA', remarks: '----' },
    { skillName: 'SQL', grade: 'A', remarks: '----' },
  ];

  if (user?.role !== 'manager') {
    return null;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search by Form Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <svg 
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Personal Information Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Name:</span> {personalInfo.name}</p>
            <p><span className="font-medium">Designation:</span> {personalInfo.designation}</p>
            <p><span className="font-medium">Department:</span> {personalInfo.department}</p>
            <p><span className="font-medium">Reporting Manager:</span> {personalInfo.reportingManager}</p>
          </div>
          <div>
            <p><span className="font-medium">DOJ:</span> {personalInfo.doj}</p>
            <p><span className="font-medium">SVM Experience:</span> {personalInfo.svmExperience}</p>
            <p><span className="font-medium">External Experience:</span> {personalInfo.externalExperience}</p>
            <p><span className="font-medium">Business unit:</span> {personalInfo.businessUnit}</p>
          </div>
        </div>
      </section>

      {/* Performance Management Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Performance Management</h2>
        <p className="text-gray-600">Lorem ipsum</p>
      </section>

      {/* Skill Management Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Skill Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skill Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {skills.map((skill, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{skill.skillName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${skill.grade === 'AAA' ? 'bg-green-100 text-green-800' : 
                        skill.grade === 'A' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {skill.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{skill.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
} 