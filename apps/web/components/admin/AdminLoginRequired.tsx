import React from "react"
import { LogIn } from "lucide-react"
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent } from '@workspace/ui/components/card'

export function AdminLoginRequired() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card>
        <CardContent className="p-12 text-center">
          <LogIn className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à l'administration.
          </p>
          <Button onClick={() => window.location.href = '/test-auth'}>
            Se connecter
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
