'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { useCompte } from '@/hooks/useCompte'
import { ShoppingBag, Heart, Zap, TrendingUp } from 'lucide-react'

export function StatistiquesCompte() {
  const { profil, statistiques } = useCompte()

  if (!profil || !statistiques) return null

  const stats = [
    {
      label: 'Commandes',
      value: profil.nombreCommandes,
      icon: ShoppingBag,
      color: 'text-blue-600'
    },
    {
      label: 'Favoris',
      value: statistiques.favorisCount,
      icon: Heart,
      color: 'text-red-600'
    },
    {
      label: 'Commandes rapides',
      value: statistiques.commandesRapidesCount,
      icon: Zap,
      color: 'text-purple-600'
    },
    {
      label: 'Total dépensé',
      value: `${profil.montantTotal.toFixed(2)}€`,
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Statistiques</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-sm font-medium text-gray-700">
                  {stat.label}
                </span>
              </div>
              <span className="font-semibold text-boulangerie-marron">
                {stat.value}
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
