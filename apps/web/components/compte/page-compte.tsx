'use client'

import React, { useState } from 'react'
import { ProfilUtilisateur } from './profil-utilisateur'
import { StatistiquesCompte } from './statistiques-compte'
import { TabsCompte } from './tabs-compte'
import { ModalAuth } from '@/components/auth/ModalAuth'
import { useCompte } from '@/hooks/useCompte'
import { LoaderIcon, LogIn, UserPlus } from 'lucide-react'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'

export function PageCompte() {
  const { isLoading, utilisateur } = useCompte()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'connexion' | 'inscription'>('connexion')

  const handleOpenAuth = (mode: 'connexion' | 'inscription') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // Le hook useCompte se mettra automatiquement à jour
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderIcon className="h-8 w-8 animate-spin text-boulangerie-gold" />
      </div>
    )
  }

  if (!utilisateur) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-boulangerie-gold to-amber-600 rounded-full flex items-center justify-center mb-6">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-boulangerie-marron mb-4">
                Accès à votre compte
              </h2>
              
              <p className="text-gray-600 mb-6">
                Connectez-vous pour accéder à votre profil, historique de commandes et favoris.
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => handleOpenAuth('connexion')}
                  className="w-full bg-boulangerie-gold hover:bg-boulangerie-gold/90"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Se connecter
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => handleOpenAuth('inscription')}
                  className="w-full border-boulangerie-gold text-boulangerie-marron hover:bg-boulangerie-gold/10"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Créer un compte
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500">
                  Pas encore de compte ? L'inscription est gratuite et vous permet de sauvegarder vos favoris et de suivre vos commandes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal d'authentification */}
        <ModalAuth
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          modeInitial={authMode}
          onSucces={handleAuthSuccess}
        />
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
