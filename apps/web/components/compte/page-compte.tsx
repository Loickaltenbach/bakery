'use client'

import React from 'react'
import { ProfilUtilisateur } from './profil-utilisateur'
import { StatistiquesCompte } from './statistiques-compte'
import { TabsCompte } from './tabs-compte'
import { useCompte } from '@/hooks/useCompte'
import { LoaderIcon } from 'lucide-react'
import { Card, CardContent } from '@workspace/ui/components/card'

export function PageCompte() {
  const { isLoading, utilisateur } = useCompte()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderIcon className="h-8 w-8 animate-spin text-boulangerie-gold" />
      </div>
    )
  }

  if (!utilisateur) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-boulangerie-marron mb-4">
              Connexion requise
            </h2>
            <p className="text-gray-600 mb-4">
              Vous devez être connecté pour accéder à votre compte.
            </p>
            <a 
              href="/test-auth" 
              className="inline-block px-6 py-2 bg-boulangerie-gold text-white rounded-lg hover:bg-boulangerie-gold/90 transition-colors"
            >
              Se connecter
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-boulangerie-marron mb-2">
            Mon Compte
          </h1>
          <p className="text-gray-600">
            Gérez votre profil, consultez votre historique et vos favoris
          </p>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profil et statistiques */}
          <div className="lg:col-span-1 space-y-6">
            <ProfilUtilisateur />
            <StatistiquesCompte />
          </div>

          {/* Onglets */}
          <div className="lg:col-span-2">
            <TabsCompte />
          </div>
        </div>
      </div>
    </div>
  )
}
