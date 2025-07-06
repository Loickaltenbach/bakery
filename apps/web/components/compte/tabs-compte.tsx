'use client'

import React from 'react'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { useCompte } from '@/hooks/useCompte'
import { HistoriqueCommandes } from '@/components/auth/HistoriqueCommandes'
import { User, History, Heart, Zap } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'

export function TabsCompte() {
  const { activeTab, setActiveTab } = useCompte()

  const tabs = [
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'historique', label: 'Historique', icon: History },
    { id: 'favoris', label: 'Favoris', icon: Heart },
    { id: 'commandes-rapides', label: 'Rapides', icon: Zap }
  ] as const

  return (
    <div>
      {/* Navigation des onglets */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 transition-colors",
                activeTab === tab.id 
                  ? "bg-white shadow-sm text-boulangerie-marron" 
                  : "text-gray-600 hover:text-boulangerie-marron"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'profil' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
            <p className="text-gray-600">
              Vous pouvez modifier vos informations personnelles dans le panneau de gauche.
            </p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'historique' && (
        <HistoriqueCommandes />
      )}

      {activeTab === 'favoris' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Mes Favoris</h3>
            <p className="text-gray-600">
              Vos produits favoris apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'commandes-rapides' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Commandes Rapides</h3>
            <p className="text-gray-600">
              Vos commandes rapides enregistrées apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
