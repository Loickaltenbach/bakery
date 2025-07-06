import React from "react"
import { Shield } from "lucide-react"
import { Button } from '@workspace/ui/components/button'
import { RoleUtilisateur } from '@/lib/auth-types'

interface AdminHeaderProps {
  utilisateur: any
}

export function AdminHeader({ utilisateur }: AdminHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Shield className="h-4 w-4" />
          <span>Interface d'administration</span>
          <span className="text-gray-400">•</span>
          <span>Connecté en tant que {utilisateur.prenom} {utilisateur.nom}</span>
          <span className="text-gray-400">•</span>
          <span className="font-medium text-blue-600">
            {utilisateur.role === RoleUtilisateur.ADMIN ? 'Administrateur' : 'Employé'}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = '/test-auth'}
        >
          Retour aux tests
        </Button>
      </div>
    </div>
  )
}
