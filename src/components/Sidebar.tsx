'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const employeeMenuItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/profile', label: 'Profile' },
    { href: '/skills', label: 'My Skills' },
    { href: '/certificates', label: 'My Certificates' },
  ];

  const managerMenuItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/profile', label: 'Profile' },
    { href: '/reports', label: 'Reports' },
  ];

  const adminMenuItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/profile', label: 'Profile' },
    { href: '/admin/users', label: 'Users Management' },
    { href: '/admin/settings', label: 'System Settings' },
    { href: '/admin/reports', label: 'Reports' },
  ];

  const menuItems = user?.role === 'employee' 
    ? employeeMenuItems 
    : user?.role === 'admin' 
    ? adminMenuItems 
    : managerMenuItems;

  return (
    <aside className="w-[250px] bg-[#1f2937] h-[calc(100vh-4rem)] text-white fixed top-16">
      <nav className="flex flex-col space-y-4 mt-8 h-full">
        {menuItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href} 
            className={`text-lg font-light px-6 py-1 ${
              pathname === item.href ? 'bg-gray-800' : ''
            } hover:bg-gray-800 transition-colors`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}