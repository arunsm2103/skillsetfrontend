'use client';

import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Modal, Form, Select, DatePicker } from 'antd';
import { EditOutlined, PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import { getUsers, createUser, updateUser, User, CreateUserPayload, UpdateUserPayload } from '@/services/userService';
import { showToast } from '@/utils/toast';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

const { Search } = Input;
const { Option } = Select;

const EmployeeGrid = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchText, users]);

  const filterUsers = () => {
    const filtered = users.filter(user => 
      user.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.employeeCode.toLowerCase().includes(searchText.toLowerCase()) ||
      user.department.toLowerCase().includes(searchText.toLowerCase()) ||
      user.designation.toLowerCase().includes(searchText.toLowerCase()) ||
      user.officialEmail.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      showToast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: CreateUserPayload) => {
    try {
      await createUser(values);
      showToast.success('User created successfully');
      fetchUsers();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      showToast.error('Failed to create user');
    }
  };

  const handleUpdate = async (values: UpdateUserPayload) => {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, values);
      showToast.success('User updated successfully');
      fetchUsers();
      setModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    } catch (error) {
      showToast.error('Failed to update user');
    }
  };

  const columns = [
    {
      title: 'Employee Code',
      dataIndex: 'employeeCode',
      key: 'employeeCode',
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 150,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'officialEmail',
      key: 'officialEmail',
      width: 200,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: User) => (
        <div className="flex items-center gap-2">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue({
                ...record,
                dateOfJoining: dayjs(record.dateOfJoining),
              });
              setModalVisible(true);
            }}
          />
          <Button
            type="link"
            icon={<FileTextOutlined />}
            onClick={() => router.push(`/reports/user/${record.id}`)}
            title="View User Report"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-full bg-gray-50 py-6">
      <div className="">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Users Management</h2>
            <div className="flex items-center gap-4">
              <Search
                placeholder="Search employees"
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingUser(null);
                  form.resetFields();
                  setModalVisible(true);
                }}
              >
                Add User
              </Button>
            </div>
          </div>
        </div>

        <div className="py-6">
          <Table
            columns={columns}
            dataSource={filteredUsers}
            loading={loading}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              style: {
                marginRight: '20px',
              },
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} employees`,
            }}
          />
        </div>
      </div>

      <Modal
        title={editingUser ? 'Edit Employee' : 'Add Employee'}
        open={modalVisible}
        width={800}
        onCancel={() => {
          setModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingUser ? handleUpdate : handleCreate}
        >
          <div className="grid grid-cols-2 gap-x-3">
            {!editingUser && (
              <>
                <Form.Item
                  name="employeeCode"
                  label="Employee Code"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="officialEmail"
                  label="Email"
                  rules={[{ required: true, type: 'email' }]}
                >
                  <Input />
                </Form.Item>
              </>
            )}

            <Form.Item
              name="employeeName"
              label="Employee Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            {!editingUser && (
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
            )}

            {!editingUser ? (
              <>
                <Form.Item
                  name="businessUnit"
                  label="Business Unit"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="department"
                  label="Department"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </>
            ) : (
              <Form.Item
                name="password"
                label="New Password"
              >
                <Input.Password />
              </Form.Item>
            )}

            <Form.Item
              name="designation"
              label="Designation"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            {!editingUser && (
              <>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="M">Male</Option>
                    <Option value="F">Female</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="admin">Admin</Option>
                    <Option value="manager">Manager</Option>
                    <Option value="employee">Employee</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="dateOfJoining"
                  label="Date of Joining"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeGrid; 