'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically call your API to handle password reset
    setMessage('If an account exists with this email, you will receive password reset instructions.');
    
    // Simulate API call delay
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="max-w-md w-full px-6">
        <h2 className="text-center text-3xl font-semibold mb-8">Forgot Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className="text-green-500 text-sm text-center">
              {message}
            </div>
          )}
          
          <div>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-500"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-sm"
            >
              Reset Password
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
} 