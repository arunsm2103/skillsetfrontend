'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ApiService from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

interface Designation {
  id: number;
  name: string;
  description: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    designationId: '',
  });
  const [error, setError] = useState('');
  const [designations, setDesignations] = useState<Designation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch designations
        const { data: designations } = await ApiService.get(ENDPOINTS.DESIGNATIONS);
        if (designations) {
          setDesignations(Array.isArray(designations) ? designations : []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await ApiService.post(ENDPOINTS.REGISTER, {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          employeeId: formData.employeeId,
          email: formData.email,
          password: formData.password,
          designationId: formData.designationId,
        }
      });

      router.push('/login');
    } catch  {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="max-w-md w-full px-6">
        <h2 className="text-center text-3xl font-semibold mb-8">Register</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-500"
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              />
            </div>
            <div>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-500"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-500"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-500"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-gray-900"
                value={formData.designationId}
                onChange={(e) => setFormData({ ...formData, designationId: e.target.value })}
              >
                <option value="">Select Designation</option>
                {designations.map((designation) => (
                  <option key={designation.id} value={designation.id}>
                    {designation.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-500"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-500"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-sm"
            >
              Register
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <span className="text-gray-600">Already have an account?</span>
          <Link href="/login" className="ml-1 text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
} 