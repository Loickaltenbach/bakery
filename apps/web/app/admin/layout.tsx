'use client';

import React, { ReactNode } from 'react';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { AdminLoading } from '@/components/admin/AdminLoading';
import { AdminLoginRequired } from '@/components/admin/AdminLoginRequired';
import { AdminAccessDenied } from '@/components/admin/AdminAccessDenied';
import { AdminHeader } from '@/components/admin/AdminHeader';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isLoading, isAuthenticated, utilisateur, hasAdminAccess } = useAdminAccess()

  if (isLoading) {
    return <AdminLoading />
  }

  if (!isAuthenticated || !utilisateur) {
    return <AdminLoginRequired />
  }

  if (!hasAdminAccess) {
    return <AdminAccessDenied />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader utilisateur={utilisateur} />
      {children}
    </div>
  );
}
