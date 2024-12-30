"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { DashboardOutlined, CustomerServiceOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";

export default function Topbar() {
  const pathname = usePathname();
  const { activeDashboard, user, logout, switchView } = useAuth();

  const getMenuItems = (role: string) => {
    const commonItems = [
      { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
      { key: 'helpdesk', label: 'Help Desk', icon: <CustomerServiceOutlined /> },
    ];

    switch (role) {
      case 'admin':
        return [
          ...commonItems,
          { key: 'users', label: 'Users', icon: <UserOutlined /> },
        ];
      case 'manager':
        return [
          { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
          { key: 'team', label: 'Team & skills', icon: <TeamOutlined /> },
          { key: 'helpdesk', label: 'Help Desk', icon: <CustomerServiceOutlined /> },
          // { key: 'skills', label: 'Skills', icon: <TrophyOutlined /> },
        ];
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems(user?.role || 'employee');

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  if (isAuthPage) return null;

  return (
    <nav className="bg-white h-14 sticky w-full top-0 shadow-md z-50 px-0">
      <div className="flex items-center h-full max-w-7xl mx-auto">
        <div className="flex items-center">
          <Image
            src="/company-logo.png"
            alt="Company Logo"
            width={36}
            height={36}
          />
          <div className="h-5 w-[1px] bg-gray-300 mx-3"></div>
          <div className="flex flex-col">
            <span className="text-md font-medium text-gray-800">SkillMatrix Pro</span>
            <span className="text-xs text-gray-600">{user?.role}</span>
          </div>
        </div>

        <div className="flex items-center justify-center mx-auto">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={`/${item.key}`} 
              className={`text-md font-light px-4 py-1 mx-2 flex items-center gap-2 ${
                pathname === `/${item.key}` 
                  ? 'text-gray-800 border-b-2 border-blue-400' 
                  : 'text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-blue-400'
              } transition-all duration-200`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {(user?.role === "manager" || user?.role === "admin") && (
            <div className="flex items-center space-x-2">
              <div 
                className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                  activeDashboard === 'employee' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => switchView('employee')}
              >
                Employee
              </div>
              {user?.role === "manager" && (
                <div 
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                    activeDashboard === 'manager' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => switchView('manager')}
                >
                  Manager
                </div>
              )}
              {user?.role === "admin" && (
                <div 
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                    activeDashboard === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => switchView('admin')}
                >
                  Admin
                </div>
              )}
            </div>
          )}
          <button
            onClick={logout}
            className="text-gray-600 hover:text-gray-800 px-3 py-1 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
