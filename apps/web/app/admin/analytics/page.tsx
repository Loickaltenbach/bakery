import React from 'react';
import DashboardAnalytics from '@/components/admin/dashboard-analytics';
import { RequireRole } from '@/components/auth/RequireRole';

export default function AnalyticsPage(): React.ReactElement {
  return (
    <RequireRole role="admin">
      <DashboardAnalytics />
    </RequireRole>
  );
}
