import { useState, useEffect } from 'react'
import { boulangerieAPI, type Commande } from '@/lib/boulangerie-api'

export function useCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chargerCommandes = async (filtres?: {
    statut?: string
    client?: string
    dateDebut?: string
    dateFin?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await boulangerieAPI.commandes.getAll(filtres)
      
      if ((response as any).success) {
        setCommandes((response as any).data)
      } else {
        throw new Error('Erreur lors du chargement des commandes')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement'
      setError(message)
      console.error('Erreur commandes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    chargerCommandes()
  }, [])

  return {
    commandes,
    loading,
    error,
    chargerCommandes,
    refetch: chargerCommandes
  }
}
