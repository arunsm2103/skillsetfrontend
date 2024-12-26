import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Input, Tooltip, Select } from 'antd';
import { SearchOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getEmployeeMatrix, EmployeeMatrix } from '@/services/dashboardService';
import { showToast } from '@/utils/toast';

const { Search } = Input;
const { Option } = Select;

const EmployeeSkillMatrix = () => {
  const [employees, setEmployees] = useState<EmployeeMatrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeMatrix[]>([]);

  useEffect(() => {
    fetchEmployeeMatrix();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchText, selectedDepartment, employees]);

  const fetchEmployeeMatrix = async () => {
    try {
      const data = await getEmployeeMatrix();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Error fetching employee matrix:', error);
      showToast.error('Failed to fetch employee skills matrix');
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        employee =>
          employee.name.toLowerCase().includes(searchLower) ||
          employee.role.toLowerCase().includes(searchLower) ||
          employee.department.toLowerCase().includes(searchLower)
      );
    }

    // Filter by department
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(
        employee => employee.department === selectedDepartment
      );
    }

    setFilteredEmployees(filtered);
  };

  const departments = [...new Set(employees.map(emp => emp.department))];

  const getSkillLevelColor = (currentLevel: string, expectedLevel: string) => {
    if (getLevelValue(currentLevel) < getLevelValue(expectedLevel)) {
      return 'orange';
    }
    if (getLevelValue(currentLevel) > getLevelValue(expectedLevel)) {
      return 'green';
    }
    return 'blue';
  };

  const getLevelValue = (level: string) => {
    const levels = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
    return levels[level as keyof typeof levels] || 0;
  };

  const columns = [
    { 
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left' as const,
      width: 150,
    },
    { 
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
    },
    { 
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    {
      title: 'Skills',
      dataIndex: 'skillAssessments',
      key: 'skills',
      render: (skillAssessments: EmployeeMatrix['skillAssessments']) => {
        // Group skills by name to handle duplicates
        const groupedSkills = skillAssessments.reduce((acc, curr) => {
          const skillName = curr.skill.name;
          if (!acc[skillName]) {
            acc[skillName] = [];
          }
          acc[skillName].push(curr);
          return acc;
        }, {} as Record<string, typeof skillAssessments>);

        return (
          <div className="space-y-2">
            {Object.entries(groupedSkills).map(([skillName, assessments]) => (
              <div key={skillName} className="flex items-center justify-between border-b last:border-0 pb-2">
                <span className="font-medium w-1/4">{skillName}</span>
                <div className="flex flex-wrap items-center gap-2 w-3/4">
                  {assessments.map((assessment: { currentLevel: string; expectedLevel: string }, index: number) => (
                    <div key={index} className="flex items-center gap-1">
                      <Tag color={getSkillLevelColor(assessment.currentLevel, assessment.expectedLevel)}>
                        Current: {assessment.currentLevel}
                      </Tag>
                      <span className="text-gray-400">→</span>
                      <Tag color="blue">Expected: {assessment.expectedLevel}</Tag>
                      {getLevelValue(assessment.currentLevel) < getLevelValue(assessment.expectedLevel) && (
                        <Tooltip title="Below expected level">
                          <WarningOutlined className="text-orange-500" />
                        </Tooltip>
                      )}
                      {getLevelValue(assessment.currentLevel) >= getLevelValue(assessment.expectedLevel) && (
                        <Tooltip title="Meeting expectations">
                          <CheckCircleOutlined className="text-green-500" />
                        </Tooltip>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <Card title="Employee Skill Matrix" className="shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <Search
          placeholder="Search by name, role, or department"
          allowClear
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select 
          defaultValue="all"
          style={{ width: 200 }}
          onChange={setSelectedDepartment}
          value={selectedDepartment}
        >
          <Option value="all">All Departments</Option>
          {departments.map(dept => (
            <Option key={dept} value={dept}>{dept}</Option>
          ))}
        </Select>
      </div>

      <Table 
        rowKey="name"
        dataSource={filteredEmployees}
        columns={columns}
        loading={loading}
        scroll={{ x: true }}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} employees`
        }}
      />
    </Card>
  );
};

export default EmployeeSkillMatrix; 