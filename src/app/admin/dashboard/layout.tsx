'use client';

import { ReactNode } from 'react';

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      {children}
    </div>
  );
} 