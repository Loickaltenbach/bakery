'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { useCompte } from '@/hooks/useCompte'
import { User, Edit2, Mail, Phone, MapPin, Calendar, LogOut } from 'lucide-react'

export function ProfilUtilisateur() {
  const { profil, isEditing, setIsEditing, deconnexion } = useCompte()

  if (!profil) return null

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-boulangerie-gold" />
            Profil
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-boulangerie-marron border-boulangerie-gold hover:bg-boulangerie-gold/10"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            {isEditing ? 'Annuler' : 'Modifier'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar et nom */}
        <div className="text-center pb-4 border-b">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-boulangerie-gold to-amber-600 rounded-full flex items-center justify-center mb-3">
            <span className="text-white text-xl font-bold">
              {profil.nom.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className="font-semibold text-lg text-boulangerie-marron">
            {profil.nom}
          </h3>
          <Badge variant="secondary" className="mt-1">
            Client
          </Badge>
        </div>

        {/* Informations */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">{profil.email}</span>
          </div>

          {profil.telephone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{profil.telephone}</span>
            </div>
          )}

          {profil.adresse && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{profil.adresse}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">
              Inscrit le {new Date(profil.dateInscription).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Bouton déconnexion */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={deconnexion}
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
