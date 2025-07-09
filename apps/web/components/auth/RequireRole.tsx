// apps/web/components/auth/RequireRole.tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface RequireRoleProps {
  role: string | string[];
  children: React.ReactNode;
  redirectTo?: string;
}

export function RequireRole({ role, children, redirectTo = '/login' }: RequireRoleProps) {
  const { utilisateur, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && utilisateur) {
      const roles = Array.isArray(role) ? role : [role];
      if (!roles.includes(utilisateur.role)) {
        router.replace(redirectTo);
      }
    } else if (!isLoading && !utilisateur) {
      router.replace(redirectTo);
    }
  }, [utilisateur, isLoading, role, router, redirectTo]);

  if (isLoading || !utilisateur) {
    return <LoadingSpinner message="Vérification des droits..." />;
  }

  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(utilisateur.role)) {
    return null;
  }

  return <>{children}</>;
}
