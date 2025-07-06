import { useAuth } from '@/contexts/AuthContext'
import { RoleUtilisateur } from '@/lib/auth-types'

export function useAdminAccess() {
  const { utilisateur, isAuthenticated, isLoading } = useAuth()

  const hasAdminAccess = utilisateur && (
    utilisateur.role === RoleUtilisateur.ADMIN || 
    utilisateur.role === RoleUtilisateur.EMPLOYE
  )

  return {
    isLoading,
    isAuthenticated,
    utilisateur,
    hasAdminAccess,
    canAccess: isAuthenticated && hasAdminAccess
  }
}
