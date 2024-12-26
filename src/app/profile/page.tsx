'use client';

import React from 'react';

export default function ProfilePage() {
  const profile = {
    employeeCode: 'SM0012',
    employeeName: 'Rathan Singh',
    businessUnit: 'Enabling Services',
    designation: 'Senior Associate HR',
    doj: '15-Sep-2003'
  };

  return (
    <div className="flex h-screen">
      {/* Left Section - 30% */}
      <div className="w-[30%] p-6 space-y-6 flex flex-col items-center border-r border-gray-300">
        {/* Profile Image */}
        <div className="text-center">
          <div className="w-48 h-48 border-2 border-gray-300 flex items-center justify-center mx-auto">
            <div className="text-gray-400 text-8xl">×</div>
          </div>
          <div className="mt-2">
            <h2 className="font-medium">User Name</h2>
            <p className="text-sm text-gray-600">Designation</p>
          </div>
        </div>

        {/* Employee Details */}
        <div className="space-y-4">
          <div>
            <label className="text-gray-600">Employee Code:</label>
            <span className="ml-2">{profile.employeeCode}</span>
          </div>
          <div>
            <label className="text-gray-600">Employee Name:</label>
            <span className="ml-2">{profile.employeeName}</span>
          </div>
          <div>
            <label className="text-gray-600">Business Unit:</label>
            <span className="ml-2">{profile.businessUnit}</span>
          </div>
          <div>
            <label className="text-gray-600">Designation:</label>
            <span className="ml-2">{profile.designation}</span>
          </div>
          <div>
            <label className="text-gray-600">DOJ:</label>
            <span className="ml-2">{profile.doj}</span>
          </div>
        </div>
      </div>

      {/* Right Section - 70% */}
      <div className="w-[70%] p-6">
        <h1 className="text-xl font-semibold">Employee Details</h1>
      </div>
    </div>
  );
}