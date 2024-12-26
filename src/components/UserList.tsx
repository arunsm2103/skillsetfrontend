'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types/user';
import UserForm from './UserForm';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // Static user data for demo
  const staticUsers: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'employee'
    },
    {
      id: 2, 
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'manager'
    }
  ];

  const fetchUsers = async () => {
    // Simulating API fetch with static data
    setUsers(staticUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      // Simulating API create
      const newUser = {
        ...userData,
        id: users.length + 1
      } as User;
      setUsers([...users, newUser]);
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!selectedUser) return;
    try {
      // Simulating API update
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, ...userData } : user
      );
      setUsers(updatedUsers);
      setIsModalOpen(false);
      setSelectedUser(undefined);
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      // Simulating API delete
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add User
      </button>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.firstName} {user.lastName}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  <button 
                    onClick={() => { setSelectedUser(user); setIsModalOpen(true); }} 
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)} 
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border px-4 py-2 text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedUser ? 'Edit User' : 'Create User'}
            </h2>
            <UserForm
              user={selectedUser}
              onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
              onCancel={() => { setIsModalOpen(false); setSelectedUser(undefined); }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 