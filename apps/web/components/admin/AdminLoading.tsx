import React from "react"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from '@workspace/ui/components/card'

export function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Vérification des droits d'accès...</p>
        </CardContent>
      </Card>
    </div>
  )
}
