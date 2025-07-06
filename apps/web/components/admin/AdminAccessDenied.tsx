import React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent } from '@workspace/ui/components/card'

export function AdminAccessDenied() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card>
        <CardContent className="p-12 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à l'administration.
            <br />
            Seuls les administrateurs et employés peuvent accéder à cette section.
          </p>
          <div className="space-x-2">
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              Retour à l'accueil
            </Button>
            <Button onClick={() => window.location.href = '/test-auth'}>
              Changer de compte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
