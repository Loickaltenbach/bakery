'use client';

import React from 'react';
import InterfaceAdmin from '@/components/admin/InterfaceAdmin';
import { RequireRole } from '@/components/auth/RequireRole';

export default function AdminPage() {
  return (
    <RequireRole role="ADMIN">
      <div className="min-h-screen bg-gray-50">
        <InterfaceAdmin />
      </div>
    </RequireRole>
  );
}
