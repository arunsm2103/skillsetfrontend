"use client";

import React, { useState, useEffect } from "react";
import { Card, Spin, Descriptions, Tag, Button } from "antd";
import {
  DownloadOutlined,
  UserOutlined,
  TrophyOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { getUser } from "@/services/userService";
import { showToast } from "@/utils/toast";
import html2pdf from "html2pdf.js";
import { useParams } from "next/navigation";

const UserReport = () => {
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchUserData(params.id as string);
    }
  }, [params.id]);

  const fetchUserData = async (userId: string) => {
    try {
      const data = await getUser(userId);
      setUserData(data);
    } catch {
      showToast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const element = document.getElementById("report-content");
    const opt = {
      margin: [0.5, 0.5],
      filename: `${userData?.employeeName}-report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "portrait",
        hotfixes: ["px_scaling"],
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
        before: ".page-break-before",
        after: ".page-break-after",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Employee Report</h1>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExportPDF}
        >
          Export as PDF
        </Button>
      </div>

      <div
        id="report-content"
        className="space-y-6 bg-white p-8 rounded-lg shadow"
      >
        {/* Header */}
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold">{userData?.employeeName}</h2>
          <p className="text-gray-500">{userData?.designation}</p>
          <p className="text-gray-500">{userData?.employeeCode}</p>
        </div>

        {/* Personal Information Section */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <UserOutlined className="text-blue-500 text-xl" />
            <h2 className="text-xl font-semibold">Personal Information</h2>
          </div>
          <Card className="bg-gray-50">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Employee Code">
                {userData?.employeeCode}
              </Descriptions.Item>
              <Descriptions.Item label="Full Name">
                {userData?.employeeName}
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {userData?.department}
              </Descriptions.Item>
              <Descriptions.Item label="Business Unit">
                {userData?.businessUnit}
              </Descriptions.Item>
              <Descriptions.Item label="Designation">
                {userData?.designation}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {userData?.officialEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color="blue">{userData?.role}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Date of Joining">
                {new Date(userData?.dateOfJoining).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Reporting Manager">
                {userData?.reportingManager?.employeeName || "Not Assigned"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={userData?.isActive ? "green" : "red"}>
                  {userData?.isActive ? "Active" : "Inactive"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </section>

        {/* Skills Management Section */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <BookOutlined className="text-green-500 text-xl" />
            <h2 className="text-xl font-semibold">Skills Assessment</h2>
          </div>
          <Card className="bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData?.skillAssessments?.map(
                (
                  assessment: {
                    skill: { name: string };
                    currentLevel: number;
                    expectedLevel: number;
                  },
                  index: number
                ) => (
                  <Card
                    key={index}
                    className="border shadow-sm page-break-inside-avoid"
                  >
                    <h3 className="font-medium mb-3">
                      {assessment.skill.name}
                    </h3>
                    <div className="flex gap-4">
                      <Tag color="blue">Current: {assessment.currentLevel}</Tag>
                      <Tag color="green">
                        Expected: {assessment.expectedLevel}
                      </Tag>
                    </div>
                    {assessment.currentLevel !== assessment.expectedLevel && (
                      <div className="mt-2 text-sm text-orange-500">
                        Gap: {assessment.expectedLevel} required
                      </div>
                    )}
                  </Card>
                )
              )}
            </div>
          </Card>
        </section>

        {/* Performance Management Section */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <TrophyOutlined className="text-yellow-500 text-xl" />
            <h2 className="text-xl font-semibold">Performance Overview</h2>
          </div>
          <Card className="bg-gray-50">
            <div className="text-center p-4">
              <p className="text-gray-500">
                Performance data will be available soon
              </p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default UserReport;
