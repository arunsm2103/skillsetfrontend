import React from 'react';
import { BrainIcon, SkillIcon, GrowthIcon } from '../icons';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] -top-[400px] -left-[400px] bg-gradient-to-br from-blue-100/40 to-indigo-200/40 rounded-full"></div>
        <div className="absolute w-[600px] h-[600px] -bottom-[300px] -right-[300px] bg-gradient-to-br from-blue-100/40 to-indigo-200/40 rounded-full"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-20 left-[20%] animate-float-slow">
          <div className="w-16 h-16 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center">
            <BrainIcon />
          </div>
        </div>
        <div className="absolute bottom-32 right-[25%] animate-float-medium">
          <div className="w-16 h-16 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center">
            <SkillIcon />
          </div>
        </div>
        <div className="absolute top-[40%] right-[15%] animate-float-fast">
          <div className="w-16 h-16 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center">
            <GrowthIcon />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl w-full flex gap-8 items-center">
          {/* Left Section - Welcome Text */}
          <div className="flex-1 hidden lg:block">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Welcome to SkillMatrix Pro
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Empower your learning journey with our comprehensive skill management platform. 
              Track progress, acquire new skills, and grow professionally.
            </p>
            <div className="flex gap-6">
              <div className="bg-white/80 backdrop-blur rounded-lg p-4 flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">Track Progress</h3>
                <p className="text-gray-600 text-sm">Monitor your skill development journey</p>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg p-4 flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">Learn & Grow</h3>
                <p className="text-gray-600 text-sm">Access learning resources and certifications</p>
              </div>
            </div>
          </div>

          {/* Right Section - Auth Form */}
          <div className="w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 