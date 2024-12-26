'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

  return (
    <div>
      <ToastContainer />
      {!isAuthPage && <TopBar />}
      {/* {!isAuthPage && <Sidebar />} */}
      <div  className={!isAuthPage ? `max-w-7xl mx-auto`:''}>
        {children}
      </div>
    </div>
  );
} 